import  { type Etudiants } from '../entities/Etudiants';
import type { IDAO } from './IDAO';

export class EtudiantsDAO implements IDAO<Etudiants> {
  private static instance: EtudiantsDAO;

  // Mock de données locales pour simuler une API
  private etudiants: Etudiants[] = [];

  private idCounter: number = 1;

  private constructor() {}

  public static getInstance(): EtudiantsDAO {
    if (!EtudiantsDAO.instance) {
      EtudiantsDAO.instance = new EtudiantsDAO();
    }
    return EtudiantsDAO.instance;
  }


  public async create(data: Etudiants): Promise<Etudiants> {
    // Générer un ID basé sur l'ID du dernier élément
    /* data.ID = this.ues.length > 0 ? (this.ues[this.ues.length - 1]?.ID ?? 0) + 1 : 1;
     return data; */

    data.ID = this.idCounter++;

    // Ajouter l'élément à la liste
    // this.etudiants.push(data);

    return data;
  }


  public async get(id: number): Promise<Etudiants> {
    const etudiants = this.etudiants.find((item) => item.ID === id);
    if (!etudiants) {
      throw new Error('Etudiant non trouvée');
    }
    return etudiants;
  }


  public async getAll(): Promise<Etudiants[]> {
    return this.etudiants;
  }

  /**
   * Met à jour un Etudiant par son ID
   * @param {number} id - L'identifiant de l'étudiant
   * @param {Etudiants} data - Les nouvelles données de l'étudiant
   * @returns {Promise<Etudiants>}
   */
  public async update(id: number, data: Etudiants): Promise<Etudiants> {
    // Update a UE document in the database
    const index = this.etudiants.findIndex((item) => item.ID === id);
    if (index === -1) {
      throw new Error('Etudiant non trouvée');
    }
    // Mettre à jour les données en conservant les anciennes valeurs
    //this.etudiants[index] = { ...this.etudiants[index], ...data };
    return this.etudiants[index];
  }

  /**
   * Supprime un étudiant par son ID
   * @param {number} id - L'identifiant de l'étudiant
   * @returns {Promise<void>}
   */
  public async delete(id: number): Promise<void> {
    const index = this.etudiants.findIndex((item) => item.ID === id);
    if (index === -1) {
      throw new Error('Etudiant non trouvée');
    }

    this.etudiants.splice(index, 1); // Supprime l'étudiant du tableau local
  }

  /* list(): Promise<UE[]> {
     return Promise.resolve([]);
   } */


  public async list(): Promise<Etudiants[]> {
    // Exemple de données mockées si le tableau est vide
    return this.etudiants;
  }
}