
// const BASE_URL = "https://getgeo.ru/api";


// const API_KEY = "34a5m5a4n7yf7ygi9x1gddy8aewfopc9w9r5crui";

// export const fetchCities = async (query: string) => {
//   const response = await fetch(`${BASE_URL}/cities?name=${query}&key=${API_KEY}`);
//   const data = await response.json();
//   return data.cities || [];
// };

// export const fetchUniversities = async (cityId: string) => {
//   const response = await fetch(`${BASE_URL}/universities?city=${cityId}&key=${API_KEY}`);
//   const data = await response.json();
//   return data.universities || [];
// };

// export const fetchFaculties = async (universityId: string) => {
//   const response = await fetch(`${BASE_URL}/specialties?university=${universityId}&key=${API_KEY}`);
//   const data = await response.json();
//   return data.specialties || [];
// };

// export const fetchEducationSuggestions = async (query: string, count = 5) => {
//     try {
//         const API_KEY = "34a5m5a4n7yf7ygi9x1gddy8aewfopc9w9r5crui"; 

//         const response = await fetch("https://api.gigdata.ru/api/v2/suggest/educations", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             Authorization: `Bearer ${API_KEY}`, 
//           },
//           body: JSON.stringify({ query, count: 5 }),
//         });
        
  
//       if (!response.ok) {
//         throw new Error(`Ошибка ${response.status}`);
//       }
  
//       const data = await response.json();
//       return data?.suggestions || [];
//     } catch (error) {
//       console.error("Ошибка при получении подсказок:", error);
//       return [];
//     }
//   };