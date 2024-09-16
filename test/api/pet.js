'use strict'
const basicRequests = require('./basicRequests.js')

/**
 * Adds a new pet to the system.
 *
 * @param {number} [id=undefined] - The ID of the pet. Optional parameter.
 * @param {object} [category=undefined] - The category (id and name) of the pet, e.g., {id: 0, "name":"dog"}. Optional parameter.
 * @param {string} [name=undefined] - The name of the pet. Optional parameter.
 * @param {array} [photoUrls=undefined] - The photo URL list of the pet. Optional parameter.
 * @param {array} [tags=undefined] - The tags list of the pet. Optional parameter.
 * @param {string} [status=undefined] - The status of the pet, e.g., available, pending, sold. Optional parameter.
 */
async function addPet(id = undefined, category = undefined, name = undefined, photoUrls = undefined,
    tags = undefined, status = undefined) {
    let headers = {"Content-Type": "application/json"}
    
    let payload = {}
    if (id !== undefined) { payload.id = id }
    if (category !== undefined) { payload.category = category }
    if (name !== undefined) { payload.name = name }
    if (photoUrls !== undefined) { payload.photoUrls = photoUrls }
    if (tags !== undefined) { payload.tags = tags }
    if (status !== undefined) { payload.status = status }
       
    return await basicRequests.post("/v2/pet", headers, payload)
}

/**
 * Retrieves the details of a pet by its ID.
 *
 * @param {number} petID - The ID of the pet to retrieve.
 */
async function getPet(petID) {
    return await basicRequests.get(`/v2/pet/${petID}`)
}

/**
 * Deletes a pet by its ID.
 *
 * @param {number} petID - The ID of the pet to delete.
 */
async function deletePet(petID) {
    return await basicRequests.del(`/v2/pet/${petID}`)
}

module.exports = {
    addPet : addPet,
    getPet : getPet,
    deletePet : deletePet
}
