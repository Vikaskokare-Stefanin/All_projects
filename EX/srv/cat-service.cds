using my.bookshop as my from '../db/schema';
using {API_RFQ_PROCESS_SRV as external} from './external/API_RFQ_PROCESS_SRV';
using {API_COMPANYCODE_SRV as external2} from './external/API_COMPANYCODE_SRV';

@cds.persistence.skip
service CatalogService {
    @readonly
    entity Books               as projection on my.Books;

    entity RequestForQuotation as
        projection on external.A_RequestForQuotationBidder {
            key RequestForQuotation,
            key PartnerCounter,
                PartnerFunction,
                Supplier
    };

    entity CompanyCode         as
        projection on external2.A_CompanyCode {
            key CompanyCode,
                CompanyCodeName
        };
}
