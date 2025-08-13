
export type FilterMaster = {
  id: string;
  idquanly: number;
  danhmuc: string;
  idxuly: string;
  tieude: string;
  chonnhieu: boolean;
  chophep: boolean;
  url: string;
};

export interface FilterMasterDetail {
  ten: string;
  ma: string;
  thamso: Array<{
    tengoi: string;
    ma: string;
    url: string;
  }>;
}
