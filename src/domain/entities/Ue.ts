export interface IUe {
  ID: number | null;
  Numero: string | null;
  Intitulee: number | null;
  Parcours: Parcours[] | null;
  toJSON(): Object;
}

export class Ue implements IUe {
  constructor(
    public ID: number | null,
    public Numero: string | null,
    public Intitulee: number | null,
    public Parcours: Parcours[] | null
  ) {}
  toJSON(): Object {

    return {

      ID: this.ID,

      Intitule: this.Intitule,

      NumeroUe: this.NumeroUe,

      Parcours: this.Parcours?.map((parcours) => parcours.ID)

    };

  }
}