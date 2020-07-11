
const axios = require('axios')
const url = 'https://integracion-rick-morty-api.herokuapp.com/graphql';

module.exports = {

    friendlyName: 'Get by Id',
 
    description: 'Receives an id and get the character information.',
 
    inputs: {
       id: {
         description: 'The ID of the character to look up.',
         // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
         // if the `userId` parameter is not a number.
         type: 'number',
         // By making the `userId` parameter required, Sails will automatically respond with
         // `res.badRequest` if it's left out.
         required: true
       }
    },
 
    exits: {
       success: {
         responseType: 'view',
         viewTemplatePath: 'pages/character'
       },
       notFound: {
         description: 'No character with the specified ID was found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function ({id}) {

        const getCharacter = async () => {
        try {
          return await axios({
            url: url,
            method: 'post',
            data: {
              query: `
              query {
                character(id: `+ String(id) +` ) {
                  id,
                  name,
                  image,
                  status, 
                  species,
                  type,
                  gender,
                  origin {
                      id,
                      name
                  },
                  location {
                      id,
                      name
                  },
                  episode {
                    id,
                    name
                  }
                }
              }
                `
            }
          });
        } catch (error) {
          console.error(error)
        }
        }

        var character = await getCharacter();
        character = character.data.data.character
 
       // If no user was found, respond "notFound" (like calling `res.notFound()`)
       if (!character) { throw 'notFound'; }
 
       // Display a personalized welcome view.
       return {
         character: character
       };
    }
 };
