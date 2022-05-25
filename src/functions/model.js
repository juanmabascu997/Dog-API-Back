const fetch = require("node-fetch");
const { Dog, Temperament } = require("../db");
const { YOUR_API_KEY } = process.env;
//``
module.exports = {

    //::::::::::::::::::::: Get Info From API :::::::::::::::::::::::::::::::::::::::://

    getApiInfo: async function (){
        let arr = await fetch(`https://api.thedogapi.com/v1/breeds?${YOUR_API_KEY}`).then(res => res.json())
        arr.map((el) =>{
            el.createdByDB = false;
            if (el.hasOwnProperty("temperament")) {
                let str = el.temperament;
                let temper = str.replace(/ /g, '').split(","); 

                let temp_obj = temper.map(el =>{
                    return {
                        name: el
                    }
                })
                el.temperament = temp_obj;
            } else {
                el.temperament = [];
            }
        })
        return arr;
    },

    //::::::::::::::::::::: Get Info From my Data Base :::::::::::::::::::::::::::::::::::::::://
    // Find all Dogs created in Db, and includes Temperament.

    getDbInfo: async function (){
        let db = await Dog.findAll({
            include: {
                model: Temperament,
                attributes: ["name"],
                through: {
                    name: "",
                },
            },
        });
        return db;
    },

    //::::::::::::::::::::: Create a new Dog :::::::::::::::::::::::::::::::::::::::://

    createDog: async function (name,height,weight,life_span,image,temperament) {
      const temperamento = await Temperament.findAll({
        where: {
          name: temperament,
        },
      });
      console.log(temperamento)
      let newDog = await Dog.create({
        name,
        height: {
          metric: `${height.min} - ${height.max}`,
        },
        weight: {
          metric: `${weight.min} - ${weight.max}`,
        },
        life_span: `${life_span.min} - ${life_span.max} years`,
        image,
        createdByDB: true,
      });

      return await newDog.addTemperament(temperamento);
    },

    //::::::::::::::::::::: Create a new Temperament :::::::::::::::::::::::::::::::::::::::://

    createNewTemperament: async function (newTemperament) {  
      await newTemperament.forEach(async (el) => {     
        await Temperament.create({                //Se crean teperamentos en la DB
          name: el,
        });
      });
    },

    //::::::::::::::::::::: Bring all temp from Api and plus to Db :::::::::::::::::::::::::::::::::::::::://

    getTemperaments: async function () {
        const getAllDogs = await fetch(
          `https://api.thedogapi.com/v1/breeds?${YOUR_API_KEY}`
        ).then((response) => response.json());              //Get all info from API
    
        let getAllTemperaments = getAllDogs
          .map((el) => el.temperament)
          .join(",")
          .replace(/ /g, "")
          .split(",")
          .sort();                                          //Divide los temperamentos, y los ordena en getAllTemperaments
    
        let set = [...new Set(getAllTemperaments)].filter((el, i) => i > 0); //new Set remueve los temperamentos repetidos. 
            //El filter filtrara los elementos cuyo indice sea mayor a 0
        set.forEach(async (el) => {     
          await Temperament.create({                //Se crean teperamentos en la DB
            name: el,
          });
        });
    
        set = set.map((el) => (el = { name: el }));   //Setea un objeto con la propiedad name en el arreglo set. 
    
        return set;
    },
}