namespace asset_management.process_flow;
// using {cuid} from '@sap/cds/common';

// entity Books {
//   key ID : Integer;
//   title  : String;
//   stock  : Integer;
// }


entity Request {
  key hrRequestID : UUID;
  requestCreationDate: DateTime default CURRENT_TIMESTAMP;
  hrID  : String;
  item  : String;
  status: String;
  parentRequestID: UUID;
  quotations: Association to many Quotation on quotations.parentRequestID = $self.parentRequestID;
}

entity Quotation {
  key quotationID : UUID;
  quotationDescription  : String;
  quotationPrice : String;
  status: String;
  parentRequestID : UUID ;
  request: Association to Request on request.parentRequestID = parentRequestID;
}

