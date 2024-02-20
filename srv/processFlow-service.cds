using asset_management.process_flow as process_flow from '../db/processFlow-model';

service CatalogService @(impl:'./processFlow-service.js') {
    // entity Books as projection on process_flow.Books;
    entity Request as projection on process_flow.Request;
    entity Quotation as projection on process_flow.Quotation;
    
    function ParentRequestGenerate(id:String) returns Request;
}

