'use strict'
const utils = require('../../helpers/utils.js')
const basicRequests = require('../../api/basicRequests.js')
const expect = require('chai').expect

describe("Store API Tests", () => {

    let ordersToDelete = []

    before( async() => {
        await utils.setLogFileName("store_api")
    })

    after( async() => {
        for(let i = 0; i < ordersToDelete.length; i++) {
            basicRequests.del(`/v2/store/order/${ordersToDelete[i]}`)
        }
    })

    beforeEach( function() {
        utils.logMessageToFile(this.currentTest.title)
    })

    //
    // POST /store/order
    //

    it("Test store order create", async() => {
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create schema", async() => {
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        
        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = utils.schemaValidation("store", "/v2/store/order", "POST",
            addOrderResponse.body, addOrderResponse.header, true, true)
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with id missing", async() => {
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with id invalid (data type)", async() => {
        let orderData = await utils.generateRandomStoreOrder("bad")
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            500, ['"code":500', '"type":"unknown"', '"message":"something bad happened"'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":500', '"type":"unknown"', '"message":"something bad happened"'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with id invalid (-1)", async() => {
        let orderData = await utils.generateRandomStoreOrder(-1)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with id invalid (0)", async() => {
        let orderData = await utils.generateRandomStoreOrder(0)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with id null", async() => {
        let orderData = await utils.generateRandomStoreOrder(null)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with petId missing", async() => {
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "id": orderData.id,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with petId invalid (data type)", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, "bad")
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            500, ['"code":500', '"type":"unknown"', '"message":"something bad happened"'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":500', '"type":"unknown"', '"message":"something bad happened"'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with petId invalid (-1)", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, -1)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with id invalid (0)", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, -1)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with petId null", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, null)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`,
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`,  
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with quantity missing", async() => {
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with quantity invalid (data type)", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, undefined, "bad")
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            500, ['"code":500', '"type":"unknown"', '"message":"something bad happened"'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":500', '"type":"unknown"', '"message":"something bad happened"'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with quantity invalid (-1)", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, undefined, -1)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with quantity invalid (0)", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, undefined, 0)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with quantity null", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, undefined, null)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }
        const dateString = orderData.shipDate.replace('Z', '+0000')

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"${dateString}"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with shipDate missing", async() => {
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "status": orderData.status,
            "complete": orderData.complete
        }

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with shipDate not a date", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, undefined, undefined, "not-a-date")
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            500, ['"code":500', '"type":"unknown"', '"message":"something bad happened"'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":500', '"type":"unknown"', '"message":"something bad happened"'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with shipDate invalid (data type)", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, undefined, undefined, 123)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "shipDate": orderData.shipDate,
            "status": orderData.status,
            "complete": orderData.complete
        }

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `"shipDate":"1970-01-01T00:00:00.123+0000"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, `shipDate":"1970-01-01T00:00:00.123+0000"`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with shipDate null", async() => {
        let orderData = await utils.generateRandomStoreOrder(undefined, undefined, undefined, null)
        const testPayload = {
            "id": orderData.id,
            "petId": orderData.petId,
            "quantity": orderData.quantity,
            "status": orderData.status,
            "complete": orderData.complete
        }

        const addOrderResponse = await basicRequests.post("/v2/store/order", 
            {"content-type":"application/json"}, testPayload)
        ordersToDelete.push(addOrderResponse.body.id)

        const testResults = await utils.multiPointVerification(addOrderResponse,
            200, [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${orderData.id}`, `"petId":${orderData.petId}`, 
                `"quantity":${orderData.quantity}`, 
                `"status":"${orderData.status}"`, `"complete":${orderData.complete}`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

})
