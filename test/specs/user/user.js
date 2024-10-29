'use strict'
const utils = require('../../helpers/utils.js')
const basicRequests = require('../../api/basicRequests.js')
const expect = require('chai').expect

describe("User API Tests", () => {

    let usersToDelete = []

    before( async() => {
        await utils.setLogFileName("user_api")
    })

    after( async() => {
        for(let i = 0; i < usersToDelete.length; i++) {
            basicRequests.del(`/v2/user/${usersToDelete[i]}`)
        }
    })

    beforeEach( function() {
        utils.logMessageToFile(this.currentTest.title)
    })

    //
    // POST /user
    //

    it("Test user create", async() => {
        let userData = await utils.generateRandomUser()
        const testPayload = {
            "id": userData.id,
            "username": userData.username,
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "email": userData.email,
            "password": userData.password,
            "phone": userData.phone,
            "userStatus": userData.userStatus
        }

        const addUserResponse = await basicRequests.post("/v2/user", 
            {"content-type":"application/json"}, testPayload)
        usersToDelete.push(userData.username)

        const testResults = await utils.multiPointVerification(addUserResponse,
            200, [`"code":200`, `"type":"unknown"`, `"message":"${userData.id}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"code":200`, `"type":"unknown"`, `"message":"${userData.id}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test user create schema", async() => {
        let userData = await utils.generateRandomUser()
        const testPayload = {
            "id": userData.id,
            "username": userData.username,
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "email": userData.email,
            "password": userData.password,
            "phone": userData.phone,
            "userStatus": userData.userStatus
        }

        const addUserResponse = await basicRequests.post("/v2/user", 
            {"content-type":"application/json"}, testPayload)
        usersToDelete.push(userData.username)

        const testResults = utils.schemaValidation("user", "/v2/user", "POST",
            addUserResponse.body, addUserResponse.header, true, true)
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

})
