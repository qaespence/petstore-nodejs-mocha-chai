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
    // POST /pet/:petId
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

})
