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
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "id": "bad",
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
            500, ['"code":500', '"type":"unknown"', '"message":"something bad happened"'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":500', '"type":"unknown"', '"message":"something bad happened"'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test store order create with id invalid (-1)", async() => {
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "id": -1,
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
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "id": 0,
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
        let orderData = await utils.generateRandomStoreOrder()
        const testPayload = {
            "id": null,
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

})
