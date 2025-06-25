# Ticket Flow

Each **Ticket** belongs to a **Source**. Upon creation, it is associated with a **Plan**, which defines how many days each of its iterations lasts. While a ticket is active, it does **not** have a `closedAt` field.

Note:

- Ticket cannot have the plan with the `days = -1` because that is a special plan for early withdrawing.

### Ticket Methods

- **NR (Non-Rollover)**:

  - The ticket has only **one** history.
  - When this history ends, the ticket is closed with the status `maturedWithdrawn`.

- **PR (Principal Rollover)**:

  - The ticket can have **multiple** histories.
  - When a history ends, a new one is automatically created.
  - The rate is updated based on the corresponding entry in the current **Plan**'s history.

- **PIR (Principal & Interest Rollover)**:
  - Similar to PR, but the **next principal** is the **sum of the previous principal and its interest**.

### Ticket History Rules

Each `TicketHistory` entry must follow this rule:

#### Relation of `maturedAt` and `issuedAt`

```
maturedAt = issuedAt + plan.days + 1
```

- `plan.days` is taken from the respective plan at the time the history is created.
- For rollover tickets (PR, PIR), each new history is chained based on the `maturedAt` of the previous one and `+ 1` day.

#### How is `interest` calculated

When a `TicketHistory` is created, its interest is calculated as:

```
interest = principal * (rate / 100) * (maturedAt - issuedAt) / 365
```

- `rate` is taken from the corresponding **PlanHistory** entry active at the time of creation.
- `now` is the creation timestamp of the history (same as `issuedAt`).

## Withdrawal Logic

When the user withdraws a ticket:

If the withdrawal date equals the `maturedAt` of the **current** ticket history, the **full interest** from that history is returned to the source's balance.

Otherwise, the interest is calculated using the early withdrawal formula:

    ```
    interest = principal * (earlyWithdrawRate / 100) * (now - issuedAt) / 365
    ```
      - `earlyWithdrawRate` is taken from the special Plan with ID `1`.
      - This plan is reserved for early withdrawals and has `days = -1`.
