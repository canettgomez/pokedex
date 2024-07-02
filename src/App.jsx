import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Grid, 
    Image, 
    Text, 
    Spinner, 
    Button, 
    HStack } from '@chakra-ui/react';
function App(){
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const[page,setPage] = useState(1);
    const totalPages = 4;
    const limit= 25;

    const fetchPokemonData = async (page) => {
        setLoading(true);
        const offset = (page - 1) * limit;
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
          const data = await response.json();
          const promises = data.results.map(async (pokemon) => {
            const pokeResponse = await fetch(pokemon.url);
            const pokeData = await pokeResponse.json();
            return pokeData;
          });
          const results = await Promise.all(promises);
          setPokemonList(results);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching the Pokémon data:", error);
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchPokemonData(page);
      }, [page]);
    
      const handleNextPage = () => {
        if (page < totalPages) {
          setPage(page + 1);
        }
      };
    
      const handlePrevPage = () => {
        if (page > 1) {
          setPage(page - 1);
        }
      };
    
      if (loading) {
        return (
          <Box textAlign="center" mt="50px">
            <Spinner size="xl" />
          </Box>
        );
      }

    return (
        <Box maxW= "1200px" mx="auto" p="4">
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="4">
                {pokemonList.map((pokemon) => (
                <Box key={pokemon.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" textAlign="center" boxShadow="md">
                    <Image src={pokemon.sprites.front_default} alt={pokemon.name} mx="auto" />
                    <Text mt="2" fontWeight="bold" fontSize="lg">
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </Text>
                    <Text>Experience: {pokemon.base_experience}</Text>
                    <Text>Weight: {pokemon.weight / 10} kg</Text>
                    <Text>Height: {pokemon.height / 10} m</Text>
                </Box>  
                ))}
            </Grid>

            <HStack justifyContent="center" mt="6">
                <Button onClick={handlePrevPage} isDisabled={page === 1}>
                Previous
                </Button>
                <Text>{`Page ${page} of ${totalPages}`}</Text>
                <Button onClick={handleNextPage} isDisabled={page === totalPages}>
                Next
                </Button>
      </HStack>
        </Box>
    )
}

export default App