import axios from 'axios';
import type { Parcours } from '../entities/Parcours';
import type { IDAO } from './IDAO';

export class ParcoursDAO implements IDAO<Parcours> {
  private static instance: ParcoursDAO;
  // private apiUrl = 'http://localhost:5173/Parcours';

  // tableau tant qu'on a pas l'api
  private parcours: Parcours[] = [];

  private idCounter: number = 1;


  private constructor() {}

  public static getInstance(): ParcoursDAO {
    if (!ParcoursDAO.instance) {
      ParcoursDAO.instance = new ParcoursDAO();
    }
    return ParcoursDAO.instance;
  }

  public async create(data: Parcours): Promise<Parcours> {
    /* try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Parcours`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
       });

       if (!response.ok) {
         throw new Error('Impossible de créer le nouveau parcours');
       }

       return await response.json();
     } catch (error) {
       throw new Error('Impossible de créer le nouveau parcours');
     }
   } */
    // prendre l'id du dernier parcours et mettre + 1
    data.ID = this.idCounter++;
    return data;
  }

  public async get(id: number): Promise<Parcours> {
    // Retrieve a Parcours document from the database
    // return { ID: id, NomParcours: 'Parcours 1', AnneeFormation: 2024 };
    return this.parcours.find((parcours) => parcours.ID === id) as Parcours;
  }

  // get all Parcours
  public async getAll(): Promise<Parcours[]> {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Parcours`);
      return response.data;
    } catch (error) {
      throw new Error('Impossible de récupérer les parcours');
    }
  }

  /* public async update(id: number, parcours: Parcours): Promise<Parcours> {
    try {
      const response = await fetch(`${this.apiUrl}/${parcours.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parcours),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du parcours');
      }

      console.log('Parcours mis à jour avec succès:', parcours);
      return parcours;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du parcours:', error);
      throw error;
    }
  } */

  public async update(id: number, data: Parcours): Promise<Parcours> {
    // Update a Parcours document in the database
    const index = this.parcours.findIndex((parcours) => parcours.ID === id);
    if (index === -1) {
      throw new Error('Parcours non trouvé');
    }
    // this.parcours[index] = { ...this.parcours[index], ...data };
    return this.parcours[index];
  }

  public async delete(id: number): Promise<void> {
    // Delete a Parcours document from the database
    // try{
    //   await axios.delete(`${import.meta.env.VITE_API_URL}/api/Parcours/${id}`);
    // } catch (error) {
    //   throw new Error('Impossible de supprimer le parcours');
    //   }
    const index = this.parcours.findIndex((parcours) => parcours.ID === id);
    if (index === -1) {
      throw new Error('Parcours non trouvé');
    }
    this.parcours.splice(index, 1);
  }

  public async list(): Promise<Parcours[]> {
    // List all Parcours documents from the database
    // return [
    //   { ID: 1, NomParcours: 'Parcours 1', AnneeFormation: 2024 },
    //   { ID: 2, NomParcours: 'Parcours 2', AnneeFormation: 2024 }
    // ];
    return this.parcours;
  }
}

function rand(arg0: number, arg1: number): number | null {
  throw new Error('Function not implemented.');
}
/* public async delete(id: number): Promise<void> {
   // Delete a Parcours document from the database
 }

 public async list(): Promise<Parcours[]> {
   // List all Parcours documents from the database
   return [
     { ID: 1, NomParcours: 'Parcours 1', AnneeFormation: 2024 },
     { ID: 2, NomParcours: 'Parcours 2', AnneeFormation: 2024 }
   ];
 }
} */
