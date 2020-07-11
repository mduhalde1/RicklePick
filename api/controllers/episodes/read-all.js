
const axios = require('axios')
const url = 'https://integracion-rick-morty-api.herokuapp.com/graphql';

module.exports = {

    friendlyName: 'Read all episodes',
 
    description: 'Home page shows all episodes',
 
    inputs: {
    },
 
    exits: {
       success: {
         responseType: 'view',
         viewTemplatePath: 'pages/homepage'
       },
       notFound: {
         description: 'No episodes were found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function () {

        var page_num = 1;
        const getEpisodes = async () => {
        try {
        return await  axios({
          url: url,
          method: 'post',
          data: {
          query: `
          query {
            episodes(page: `+ String(page_num)+`) {
                info {
                count
                next
                }
                results {
                id
                name
                air_date
                episode
                }
            }
        }`
        }
        });
        } catch (error) {
          console.error(error)
        }
        }


        var episodes = await getEpisodes();
        episodes = episodes.data.data.episodes;
        var results = episodes.results;
        while (episodes.info.next){
          page_num = episodes.info.next
          episodes = await getEpisodes(episodes.info.next);
          episodes = episodes.data.data.episodes;
          results.push.apply(results, episodes.results)
        }



       // If no user was found, respond "notFound" (like calling `res.notFound()`)
       if (!episodes) { throw 'notFound'; }
        
       // Display a personalized welcome view.
       return {
         episodes: results
       };
    }
 };
