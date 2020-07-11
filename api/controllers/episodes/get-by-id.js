
const axios = require('axios')
const url = 'https://integracion-rick-morty-api.herokuapp.com/graphql';

module.exports = {

    friendlyName: 'Get by Id',
 
    description: 'Receives an id and get the episode information.',
 
    inputs: {
       id: {
         description: 'The ID of the episode to look up.',
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
         viewTemplatePath: 'pages/episode'
       },
       notFound: {
         description: 'No episode with the specified ID was found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function ({id}) {


        const getEpisode = async () => {
        try {
        return await axios({
          url: url,
          method: 'post',
          data: {
          query: `
           query {episode(id: `+ String(id)+`) {
              id,
              name,
              air_date, 
              episode,
              characters {
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

        var episode = await getEpisode();
        episode = episode.data.data.episode
 
       // If no user was found, respond "notFound" (like calling `res.notFound()`)
       if (!episode) { throw 'notFound'; }
 
       // Display a personalized welcome view.
       return {
         episode: episode
       };
    }
 };
