const cds = require('@sap/cds');
const { log } = require('console');
const { uuid } = cds.utils;



const { Request } = cds.entities('asset_management.process_flow')

module.exports = cds.service.impl( function () {

    this.on('ParentRequestGenerate', async (req) => {
        //console.log("====================================")
        //console.log(req);
        let tempUUID = uuid();
        console.log('---------hi', req.data)
        await UPDATE (Request) .where ({ hrRequestID : req.data.id }) .set({ parentRequestID : tempUUID}) ;
        let temp = await SELECT.from (Request).where({hrRequestID:req.data.id });
        return temp;
    })

})




// const cds = require('@sap/cds');
// const { uuid } = cds.utils;

// const { Request } = cds.entities('asset_management.process_flow');

// module.exports = cds.service.impl(async function () {
//     this.on('ParentRequestGenerate', async (req) => {
//         const { id } = req.data;
//         const tempUUID = uuid();
        
//         if (!Array.isArray(id)) {
//             throw new Error('ID should be an array');
//         }

//         for (const requestId of id) {
//             console.log(requestId)
//             await UPDATE(Request)
//                 .where({ hrRequestID: requestId })
//                 .set({ parentRequestID: tempUUID });
//         }

//         const updatedRequests = await SELECT.from(Request).where({ hrRequestID: { in: id } });

//         return updatedRequests;
//     });
// });


