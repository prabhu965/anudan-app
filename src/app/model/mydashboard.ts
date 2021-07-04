
export class ActionsPending {
  Grants: number = 0;
  Reports: number = 0;
  DisbursementApprovals: number = 0;
}

export class UpcomingGrants {
  DraftGrants: number = 0;
  Grantsinmyworkflow: number = 0;
  GrantAmount: number = 0;
}

export class Summary {
  ActionsPending: ActionsPending = new ActionsPending();
  UpcomingGrants: UpcomingGrants = new UpcomingGrants();
}

export class Value {
  name: string = '';
  value: string = '';
  count: number = 0;
}

export class Disbursement {
  name: string = '';
  values: Value[] = [];
}

export class Summary2 {
  disbursement: Disbursement[] = [];
}

export class DueOverdueSummary {
  name: string = '';
  value: number = 0;
}

export class ApprovedReportsSummary {
  name: string = '';
  value: number = 0;
}

export class Detail {
  name: string = '';
  summary: Summary2 = new Summary2();
  DueOverdueSummary: DueOverdueSummary[] = [];
  ApprovedReportsSummary: ApprovedReportsSummary[] = [];
}

export class Filter {
  name: string = '';
  totalGrants: number = 0;
  granteeOrgs: number = 0;
  grantswithnoapprovedreports: number = 0;
  grantswithnokpis: number = 0;
  period: string = '';
  disbursedAmount: number = 0;
  committedAmount: number = 0;
  details: Detail[] = [];
}

export class MyCategory {
  name: string = '';
  summary: Summary = new Summary();
  filters: Filter[] = [];
}


