type CreateVnPayParams = {
  vnp_ReturnUrl: string;

  vnp_Amount: number;

  vnp_IpAddr: string;

  vnp_TxnRef: string;

  vnp_OrderInfo: string;
};

type TranferMoneysParams = {
  fromSourceId: string;

  toSourceId: string;

  money: number;

  createAt: Date;
};

export { CreateVnPayParams, TranferMoneysParams };
