const axios = require('axios')
const url = 'https://integracion-rick-morty-api.herokuapp.com/graphql';

module.exports = {

    friendlyName: 'Get by Id',
 
    description: 'Receives an id and get the location information.',
 
    inputs: {
       id: {
         description: 'The ID of the location to look up.',
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
         viewTemplatePath: 'pages/location'
       },
       notFound: {
         description: 'No location with the specified ID was found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function ({id}) {

        const getLocation= async () => {
        try {
        return await axios({
          url: url,
          method: 'post',
          data: {
            query: `
            query {
              location(id: `+ String(id)+`) {
                id,
                name,
                type,
                dimension,
                residents{
                    id,
                    name
                }
              }
            }`
          }
        });
        } catch (error) {
          console.error(error)
        }
        }

        var location = await getLocation();
        location = location.data.data.location;
 
       // If no user was found, respond "notFound" (like calling `res.notFound()`)
       if (!location) { throw 'notFound'; }
 
       // Display a personalized welcome view.
       return {
         location: location
       };
    }
 };
