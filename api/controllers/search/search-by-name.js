
const axios = require('axios')
var _ = require('lodash');
const url = 'https://integracion-rick-morty-api.herokuapp.com/graphql';

module.exports = {

    friendlyName: 'Get by word',
 
    description: 'Receives a word and searches if theres an episode, character and location with that name.',
 
    inputs: {
       name: {
         description: 'The name of the word to look up.',
         // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
         // if the `userId` parameter is not a number.
         type: 'string',
         // By making the `userId` parameter required, Sails will automatically respond with
         // `res.badRequest` if it's left out.
         required: false
       }
    },
 
    exits: {
       success: {
         responseType: 'view',
         viewTemplatePath: 'pages/search'
       },
       notFound: {
         description: 'No episode/character/location with the specified word was found in the API.',
         responseType: 'notFound'
       }
    },

     
    fn: async function ({name}) {
      var result = {'search': name}
      name = encodeURIComponent(name)


        // for episode:
        page_num = 1
        const getEpisode = async () => {
          try {
            return await axios({
              url: url,
              method: 'post',
              data: {
              query: `query {
                    episodes(filter: {name: "`+ String(name)+`" }, page: `+ String(page_num)+`) {
                    info {
                        count
                        next
                        }
                    results {
                        id
                        name
                    }
                }
            }`
            }
            });
        } catch (error) {
            return false;
        }
        }

        var episodes = await getEpisode();
        console.log(episodes)

        if (episodes){
          if (episodes.data.data.episodes)
          {
          results_episodes = episodes.data.data.episodes.results
      
          episodes = episodes.data.data.episodes;
          var results_episodes = episodes.results;
  
          while (episodes.info.next){
            page_num = episodes.info.next
            episodes = await getEpisode(episodes.info.next);
            episodes = episodes.data.data.episodes;
            results_episodes.push.apply(results_episodes, episodes.results)
          }
          result["episodes"] = results_episodes
        }
        }



      //   // for location:
      page_num = 1
      const getLocations = async () => {
          try {
              return await axios({
                url: url,
                method: 'post',
                data: {
                query: `query {
                      locations(filter: {name: "`+ String(name)+`" }, page: `+ String(page_num)+`) {
                      info {
                          count
                          next
                          }
                      results {
                          id
                          name
                      }
                  }
              }`
              }
              });
          } catch (error) {
              return false;
          }
      }
      var locations = await getLocations();

      if (locations){
        if (locations.data.data.locations)
        {
        results_locations = locations.data.data.locations.results

        locations = locations.data.data.locations;
        var results_locations = locations.results;

        while (locations.info.next){
          page_num = locations.info.next
          locations = await getLocations(locations.info.next);
          locations = locations.data.data.locations;
          results_locations.push.apply(results_locations, locations.results)
        }
        result["locations"] = results_locations
      }
      }



        // for character:
        page_num = 1
        const getCharacters = async () => {
          try {
              return await axios({
                url: url,
                method: 'post',
                data: {
                query: `query {
                  characters(filter: {name: "`+ String(name)+`"}, page: `+ String(page_num)+`) {
                      info {
                          count
                          next
                          }
                      results {
                          id
                          name
                      }
                  }
              }`
              }
              });
          } catch (error) {
              return false;
          }
      }
      var characters = await getCharacters();

      if (characters){
        if (characters.data.data.characters){
        results_characters = characters.data.data.characters.results
        characters = characters.data.data.characters;
        var results_characters = characters.results;

        while (characters.info.next){
          page_num = characters.info.next
          characters = await getCharacters();
          characters = characters.data.data.characters;
          results_characters.push.apply(results_characters, characters.results)
        }
        result["characters"] = results_characters
      }
      }
      
       if (!result) { throw 'notFound'; }
       // Display a personalized welcome view.
       return {
         result: result
       };
    }
 };
