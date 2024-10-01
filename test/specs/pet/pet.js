'use strict'
const utils = require('../../helpers/utils.js')
const basicRequests = require('../../api/basicRequests.js')
const expect = require('chai').expect

describe("Pet API Tests", () => {

    let petsToDelete = []

    before( async() => {
        await utils.setLogFileName("pet_api")
    })

    after( async() => {
        for(let i = 0; i < petsToDelete.length; i++) {
            basicRequests.del(`/v2/pet/${petsToDelete[i]}`)
        }
    })

    beforeEach( function() {
        utils.logMessageToFile(this.currentTest.title)
    })

    //
    // POST /pet
    //

    it("Test pet create", async() => {
        let petData = await utils.generateRandomPet()
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create schema", async() => {
        let petData = await utils.generateRandomPet()
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = utils.schemaValidation("pet", "/v2/pet", "POST",
            addPetResponse.body, addPetResponse.header, false, true)
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with id missing", async() => {
        let petData = await utils.generateRandomPet()
        const testPayload = {
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with id invalid (data type)", async() => {
        let petData = await utils.generateRandomPet()
        const testPayload = {
            "id": "bad",
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            500, ['"code":500', '"type":"unknown"', '"message":"something bad happened"'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":500', '"type":"unknown"', '"message":"something bad happened"'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with id invalid (-1)", async() => {
        let petData = await utils.generateRandomPet()
        const testPayload = {
            "id": -1,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with id null", async() => {
        let petData = await utils.generateRandomPet()
        const testPayload = {
            "id": null,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with name with spaces", async() => {
        let petData = await utils.generateRandomPet()
        petData.name += " with spaces"
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with name empty string", async() => {
        let petData = await utils.generateRandomPet()
        petData.name = ""
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with name missing", async() => {
        let petData = await utils.generateRandomPet()
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with name invalid (data type)", async() => {
        let petData = await utils.generateRandomPet()
        petData.name = 123
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with name over 1024 characters", async() => {
        let petData = await utils.generateRandomPet()
        petData.name = utils.stringGen(1025)
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with name null", async() => {
        let petData = await utils.generateRandomPet()
        petData.name = null
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`,
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.id missing", async() => {
        let petData = await utils.generateRandomPet()
        delete petData.category.id
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`,`"name":"${petData.name}"`, 
                `"category":{"id":0,"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"name":"${petData.name}"`, 
                `"category":{"id":0,"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.id invalid (data type)", async() => {
        let petData = await utils.generateRandomPet()
        petData.category.id = "bad"
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            500, ['"code":500', '"type":"unknown"', '"message":"something bad happened"'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":500', '"type":"unknown"', '"message":"something bad happened"'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.id invalid (-1)", async() => {
        let petData = await utils.generateRandomPet()
        petData.category.id = -1
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`,`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.id null", async() => {
        let petData = await utils.generateRandomPet()
        petData.category.id = null
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`,`"name":"${petData.name}"`, 
                `"category":{"id":0,"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"name":"${petData.name}"`, 
                `"category":{"id":0,"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.name with spaces", async() => {
        let petData = await utils.generateRandomPet()
        petData.category.name += " with spaces"
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.name empty string", async() => {
        let petData = await utils.generateRandomPet()
        petData.category.name = ""
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.name missing", async() => {
        let petData = await utils.generateRandomPet()
        delete petData.category.name
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id}}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id}}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.name invalid (data type)", async() => {
        let petData = await utils.generateRandomPet()
        petData.category.name = 123
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.name over 1024 characters", async() => {
        let petData = await utils.generateRandomPet()
        petData.category.name = utils.stringGen(1025)
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with category.name null", async() => {
        let petData = await utils.generateRandomPet()
        petData.category.name = null
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`,
                `"category":{"id":${petData.category.id}}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id}}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with photo urls 1 valid", async() => {
        let petData = await utils.generateRandomPet()
        petData.photoUrls = ["http://test.com/photo1.jpg"]
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with photo urls 2 valid", async() => {
        let petData = await utils.generateRandomPet()
        petData.photoUrls = ["http://test.com/photo1.jpg", "http://test.com/photo2.jpg"]
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with photo urls same twice", async() => {
        let petData = await utils.generateRandomPet()
        petData.photoUrls = ["http://test.com/photo1.jpg", "http://test.com/photo1.jpg"]
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with photo urls 1 invalid", async() => {
        let petData = await utils.generateRandomPet()
        petData.photoUrls = ["not-a-url"]
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with photo urls a mix of valid and invalid", async() => {
        let petData = await utils.generateRandomPet()
        petData.photoUrls = ["http://test.com/photo1.jpg", "not-a-url"]
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with photo urls missing", async() => {
        let petData = await utils.generateRandomPet()
        delete petData.photoUrls
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with photo urls invalid (data type)", async() => {
        let petData = await utils.generateRandomPet()
        petData.photoUrls = 123
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            500, ['"code":500', '"type":"unknown"', '"message":"something bad happened"'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":500', '"type":"unknown"', '"message":"something bad happened"'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with photo urls empty list", async() => {
        let petData = await utils.generateRandomPet()
        petData.photoUrls = []
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with photo urls null", async() => {
        let petData = await utils.generateRandomPet()
        petData.photoUrls = null
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"tags"', `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"tags"', `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.id missing", async() => {
        let petData = await utils.generateRandomPet()
        delete petData.tags[0].id
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"',
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"',
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.id invalid (data type)", async() => {
        let petData = await utils.generateRandomPet()
        petData.tags[0].id = "bad"
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)

        const testResults = await utils.multiPointVerification(addPetResponse,
            500, ['"code":500', '"type":"unknown"', '"message":"something bad happened"'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":500', '"type":"unknown"', '"message":"something bad happened"'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.id invalid (-1)", async() => {
        let petData = await utils.generateRandomPet()
        petData.tags[0].id = -1
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.id null", async() => {
        let petData = await utils.generateRandomPet()
        petData.tags[0].id = null
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"',
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"',
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.name with spaces", async() => {
        let petData = await utils.generateRandomPet()
        petData.tags[0].name += " with spaces"
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.name empty string", async() => {
        let petData = await utils.generateRandomPet()
        petData.tags[0].name = ""
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.name missing", async() => {
        let petData = await utils.generateRandomPet()
        delete petData.tags[0].name
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.name invalid (data type)", async() => {
        let petData = await utils.generateRandomPet()
        petData.tags[0].name = 123
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.name over 1024 characters", async() => {
        let petData = await utils.generateRandomPet()
        petData.tags[0].name = utils.stringGen(1025)
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with tags.name null", async() => {
        let petData = await utils.generateRandomPet()
        petData.tags[0].name = null
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with status available", async() => {
        let petData = await utils.generateRandomPet()
        petData.status = "available"
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with status pending", async() => {
        let petData = await utils.generateRandomPet()
        petData.status = "pending"
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with status sold", async() => {
        let petData = await utils.generateRandomPet()
        petData.status = "sold"
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with status unsupported", async() => {
        let petData = await utils.generateRandomPet()
        petData.status = "unsupported"
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with status missing", async() => {
        let petData = await utils.generateRandomPet()
        delete petData.status
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"]], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"]])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with status invalid (data type)", async() => {
        let petData = await utils.generateRandomPet()
        petData.status = 123
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with status null", async() => {
        let petData = await utils.generateRandomPet()
        petData.status = null
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"]], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"]])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    //
    // GET /pet/:petId
    //

    async function createTestPet() {
        let petData = await utils.generateRandomPet()
        const testPayload = {
            "id": petData.id,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const addPetResponse = await basicRequests.post("/v2/pet", {"content-type":"application/json"}, 
            testPayload)
        petsToDelete.push(addPetResponse.body.id)
        petData.token = await addPetResponse.body.id

        return await petData
    }

    it("Test pet fetch", async() => {
        let petData = await createTestPet()

        const fetchPetResponse = await basicRequests.get(`/v2/pet/${petData.token}`)

        const testResults = await utils.multiPointVerification(fetchPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet fetch schema", async() => {
        let petData = await createTestPet()

        const fetchPetResponse = await basicRequests.get(`/v2/pet/${petData.token}`)

        const testResults = utils.schemaValidation("pet", "/v2/pet/:pet_id", "GET",
            fetchPetResponse.body, fetchPetResponse.header, false, true)
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet fetch with bad id/token", async() => {
        const fetchPetResponse = await basicRequests.get(`/v2/pet/bad`)

        const testResults = await utils.multiPointVerification(fetchPetResponse,
            404, ['"type":"unknown"', 
                '"message":"java.lang.NumberFormatException: For input string', 'bad'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"type":"unknown"', 
                '"message":"java.lang.NumberFormatException: For input string', 'bad'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    //
    // PUT /pet
    //

    it("Test pet update (PUT json, all fields valid)", async() => {
        let petData = await createTestPet()
        let newPetData = await utils.generateRandomPet()
        const testPayload = {
            "id": petData.token,
            "category": newPetData.category,
            "name": newPetData.name,
            "photoUrls": newPetData.photoUrls,
            "tags": newPetData.tags,
            "status": newPetData.status
        }
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)

        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${newPetData.name}"`, 
                `"category":{"id":${newPetData.category.id},"name":"${newPetData.category.name}"}`,
                '"photoUrls"', newPetData.photoUrls[0], '"tags"', newPetData.tags[0]["id"],
                newPetData.tags[0]["name"], `"status":"${newPetData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${newPetData.name}"`, 
                `"category":{"id":${newPetData.category.id},"name":"${newPetData.category.name}"}`,
                '"photoUrls"', newPetData.photoUrls[0], '"tags"', newPetData.tags[0]["id"],
                newPetData.tags[0]["name"], `"status":"${newPetData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update schema (PUT json)", async() => {
        let petData = await createTestPet()
        let newPetData = await utils.generateRandomPet()
        const testPayload = {
            "id": petData.token,
            "category": newPetData.category,
            "name": newPetData.name,
            "photoUrls": newPetData.photoUrls,
            "tags": newPetData.tags,
            "status": newPetData.status
        }
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)

        const testResults = utils.schemaValidation("pet", "/v2/pet", "PUT",
            updatePetResponse.body, updatePetResponse.header, false, true)
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, category.id valid)", async() => {
        let petData = await createTestPet()
        let newPetData = await utils.generateRandomPet()
        const testPayload = {
            "id": petData.token,
            "category": {"id": newPetData.category.id, "name": petData.category.name},
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${newPetData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${newPetData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, category.name valid)", async() => {
        let petData = await createTestPet()
        let newPetData = await utils.generateRandomPet()
        const testPayload = {
            "id": petData.token,
            "category": {"id": petData.category.id, "name": newPetData.category.name},
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${newPetData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${newPetData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, category.name missing)", async() => {
        let petData = await createTestPet()
        const testPayload = {
            "id": petData.token,
            "category": {"id": petData.category.id},
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id}}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id}}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, category.name invalid data type)", async() => {
        let petData = await createTestPet()
        const testPayload = {
            "id": petData.token,
            "category": {"id": petData.category.id, "name": 123},
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"123"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"123"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, category.name null)", async() => {
        let petData = await createTestPet()
        const testPayload = {
            "id": petData.token,
            "category": {"id": petData.category.id, "name": null},
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id}}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id}}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, name valid)", async() => {
        let petData = await createTestPet()
        let newPetData = await utils.generateRandomPet()
        const testPayload = {
            "id": petData.token,
            "category": petData.category,
            "name": newPetData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": petData.status
        }
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${newPetData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${newPetData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, photoUrls valid)", async() => {
        let petData = await createTestPet()
        let newPetData = await utils.generateRandomPet()
        let testPayload = {
            "id": petData.token,
            "category": petData.category,
            "name": petData.name,
            "tags": petData.tags,
            "status": petData.status
        }
        testPayload.photoUrls = []
        testPayload.photoUrls.push(newPetData.photoUrls[0])
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', newPetData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', newPetData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, tags.id valid)", async() => {
        let petData = await createTestPet()
        let newPetData = await utils.generateRandomPet()
        let testPayload = {
            "id": petData.token,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "status": petData.status
        }
        testPayload.tags = []
        testPayload.tags.push({"id": newPetData.tags[0].id, "name":petData.tags[0].name})
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', newPetData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', newPetData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, tags.name valid)", async() => {
        let petData = await createTestPet()
        let newPetData = await utils.generateRandomPet()
        let testPayload = {
            "id": petData.token,
            "category": petData.category,
            "name": petData.name,
            "photoUrls": petData.photoUrls,
            "status": petData.status
        }
        testPayload.tags = []
        testPayload.tags.push({"id": petData.tags[0].id, "name":newPetData.tags[0].name})
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                newPetData.tags[0]["name"], `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                newPetData.tags[0]["name"], `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet update (PUT json, status valid)", async() => {
        let petData = await createTestPet()
        let newPetData = await utils.generateRandomPet()
        newPetData.status = "updated"
        const testPayload = {
            "id": petData.token,
            "category": petData.category,
            "name": newPetData.name,
            "photoUrls": petData.photoUrls,
            "tags": petData.tags,
            "status": newPetData.status
        }
        const updatePetResponse = await basicRequests.put('/v2/pet', 
            {"content-type":"application/json"}, testPayload)
        
        const testResults = await utils.multiPointVerification(updatePetResponse,
            200, [`"id":${petData.token}`, `"name":"${newPetData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${newPetData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.token}`, `"name":"${newPetData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', petData.photoUrls[0], '"tags"', petData.tags[0]["id"],
                petData.tags[0]["name"], `"status":"${newPetData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    //
    // DELETE /pet/:petId
    //

    it("Test pet delete", async() => {
        let petData = await createTestPet()

        const deletePetResponse = await basicRequests.del(`/v2/pet/${petData.token}`)

        const testResults = await utils.multiPointVerification(deletePetResponse,
            200, ['"code":200', '"type":"unknown"', `"message":"${petData.token}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"code":200', '"type":"unknown"', `"message":"${petData.token}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet delete schema", async() => {
        let petData = await createTestPet()

        const deletePetResponse = await basicRequests.del(`/v2/pet/${petData.token}`)

        const testResults = utils.schemaValidation("pet", "/v2/pet/:pet_id", "DELETE",
            deletePetResponse.body, deletePetResponse.header, true, true)
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet delete with bad id/token", async() => {
        const deletePetResponse = await basicRequests.del(`/v2/pet/bad`)

        const testResults = await utils.multiPointVerification(deletePetResponse,
            404, ['"type":"unknown"', 
                '"message":"java.lang.NumberFormatException: For input string', 'bad'], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            ['"type":"unknown"', 
                '"message":"java.lang.NumberFormatException: For input string', 'bad'])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

})
