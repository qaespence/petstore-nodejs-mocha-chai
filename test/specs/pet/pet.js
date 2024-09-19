'use strict'
const utils = require('../../helpers/utils.js')
const petApi = require('../../api/pet.js')
const expect = require('chai').expect

describe("Pet API Tests", () => {

    let petsToDelete = []

    before( async() => {
        await utils.setLogFileName("pet_api")
    })

    after( async() => {
        for(let i = 0; i < petsToDelete.length; i++) {
            await petApi.deletePet(petsToDelete[i])
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
        const addPetResponse = await petApi.addPet(petData.id, petData.category, petData.name, 
            petData.photoUrls, petData.tags, petData.status)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"id":${petData.id}`, `"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create schema", async() => {
        let petData = await utils.generateRandomPet()
        const addPetResponse = await petApi.addPet(petData.id, petData.category, petData.name, 
            petData.photoUrls, petData.tags, petData.status)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = utils.schemaValidation("pet", "/v2/pet", "POST",
            addPetResponse.body, addPetResponse.header, false, true)
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with id missing", async() => {
        let petData = await utils.generateRandomPet()
        const addPetResponse = await petApi.addPet(undefined, petData.category, petData.name, 
            petData.photoUrls, petData.tags, petData.status)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with id invalid (data type)", async() => {
        let petData = await utils.generateRandomPet()
        const addPetResponse = await petApi.addPet("abc", petData.category, petData.name, 
            petData.photoUrls, petData.tags, petData.status)
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
        const addPetResponse = await petApi.addPet(-1, petData.category, petData.name, 
            petData.photoUrls, petData.tags, petData.status)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    })

    it("Test pet create with id null", async() => {
        let petData = await utils.generateRandomPet()
        const addPetResponse = await petApi.addPet(null, petData.category, petData.name, 
            petData.photoUrls, petData.tags, petData.status)
        petsToDelete.push(addPetResponse.body.id)

        const testResults = await utils.multiPointVerification(addPetResponse,
            200, [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', `"status":"${petData.status}"`], undefined, 
                ['"content-type":"application/json"', '"transfer-encoding":"chunked"', '"connection":"close"',
                '"access-control-allow-origin":"*"', '"access-control-allow-methods":"GET, POST, DELETE, PUT"',
            '"access-control-allow-headers":"Content-Type, api_key, Authorization"'], undefined, 
            [`"name":"${petData.name}"`, 
                `"category":{"id":${petData.category.id},"name":"${petData.category.name}"}`,
                '"photoUrls"', '"tags"', `"status":"${petData.status}"`])
        expect(testResults, "Verify test results").to.equal("No mismatch values")
    }) 

})
