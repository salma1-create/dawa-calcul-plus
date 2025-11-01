declare module '@/data/medications-cnss.json' {
  interface Medication {
    id: number;
    name: string;
    dci: string;
    dosage: string;
    forme: string;
    presentation: string;
    ppv: number;
    prix_br: number;
    taux_remb: number;
    cnops_taux_remb: number;
    reimbursement_amount: number;
    patient_pays: number;
    type: string;
    insurance: string;
  }
  
  const medications: Medication[];
  export default medications;
}
