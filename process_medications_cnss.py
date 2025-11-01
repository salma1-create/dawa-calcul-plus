import pandas as pd
import json
import re

# Read the Excel file
excel_file = r"C:\Users\LENOVO\Desktop\dawa-calcul-plus\ref-des-medicaments-cnops-2014 (1).xlsx"

print("Reading Excel file for CNSS processing...")
df = pd.read_excel(excel_file, engine='openpyxl')

print(f"\n=== Processing {len(df)} medications for CNSS database ===\n")

# Function to extract percentage from string like "70%"
def extract_percentage(value):
    if pd.isna(value):
        return 0
    if isinstance(value, str):
        match = re.search(r'(\d+)', value)
        return int(match.group(1)) if match else 0
    return int(value)

# CNSS Reimbursement Logic
def calculate_cnss_reimbursement(base_price, cnops_rate):
    """
    CNSS reimbursement rules:
    - 70% for private sector (standard)
    - 90% for serious/chronic illnesses (originally 70% or higher in CNOPS)
    - Special rates (77-100%) for specific conditions
    
    We'll apply logic based on the original CNOPS rate:
    - If CNOPS = 0%: CNSS = 0% (non-reimbursable)
    - If CNOPS = 70%: CNSS = 70% (standard private care)
    - If CNOPS had higher rate: may qualify for CNSS 90%
    """
    
    if cnops_rate == 0:
        # Non-reimbursable medications stay non-reimbursable
        return 0
    elif cnops_rate == 70:
        # Standard reimbursement for private care
        return 70
    elif cnops_rate >= 80:
        # Likely serious/chronic condition - higher rate
        return 90
    else:
        # Default to 70% for other cases
        return 70

# Process the data
medications_cnss = []

for idx, row in df.iterrows():
    try:
        # Extract data from columns
        name = str(row['NOM']).strip() if pd.notna(row['NOM']) else ""
        dci = str(row['DCI1']).strip() if pd.notna(row['DCI1']) else ""
        dosage = str(row['DOSAGE1']).strip() if pd.notna(row['DOSAGE1']) else ""
        unit = str(row['UNITE_DOSAGE1']).strip() if pd.notna(row['UNITE_DOSAGE1']) else ""
        forme = str(row['FORME']).strip() if pd.notna(row['FORME']) else ""
        presentation = str(row['PRESENTATION']).strip() if pd.notna(row['PRESENTATION']) else ""
        ppv = float(row['PPV']) if pd.notna(row['PPV']) and row['PPV'] != 0 else 0
        prix_br = float(row['PRIX_BR']) if pd.notna(row['PRIX_BR']) else ppv
        cnops_taux_remb = extract_percentage(row['TAUX_REMBOURSEMENT'])
        princeps_generique = str(row['PRINCEPS_GENERIQUE']).strip() if pd.notna(row['PRINCEPS_GENERIQUE']) else ""
        
        # Skip medications with no price or no name
        if ppv == 0 or not name:
            continue
        
        # Calculate CNSS reimbursement rate based on CNOPS rate
        cnss_taux_remb = calculate_cnss_reimbursement(prix_br, cnops_taux_remb)
        
        # Calculate reimbursement amount for CNSS
        reimbursement_amount = (prix_br * cnss_taux_remb) / 100
        patient_pays = max(0, ppv - reimbursement_amount)
        
        # Create full dosage string
        full_dosage = f"{dosage} {unit}" if dosage and unit else ""
        
        # Create medication object for CNSS
        medication = {
            "id": idx + 1,
            "name": name,
            "dci": dci,
            "dosage": full_dosage,
            "forme": forme,
            "presentation": presentation,
            "ppv": round(ppv, 2),  # Public sale price
            "prix_br": round(prix_br, 2),  # Base reimbursement price
            "taux_remb": cnss_taux_remb,  # CNSS reimbursement rate %
            "cnops_taux_remb": cnops_taux_remb,  # Original CNOPS rate for reference
            "reimbursement_amount": round(reimbursement_amount, 2),
            "patient_pays": round(patient_pays, 2),
            "type": "Princeps" if princeps_generique == "P" else "Générique" if princeps_generique == "G" else "Unknown",
            "insurance": "CNSS"
        }
        
        medications_cnss.append(medication)
        
    except Exception as e:
        print(f"Error processing row {idx}: {e}")
        continue

print(f"✓ Successfully processed {len(medications_cnss)} medications for CNSS")
print(f"✓ Skipped {len(df) - len(medications_cnss)} invalid entries")

# Save to JSON file
output_file = "src/data/medications-cnss.json"
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(medications_cnss, f, ensure_ascii=False, indent=2)

print(f"\n✓ Data saved to: {output_file}")

# Display statistics
print("\n=== CNSS Statistics ===")
print(f"Total medications: {len(medications_cnss)}")
print(f"Average PPV: {sum(m['ppv'] for m in medications_cnss) / len(medications_cnss):.2f} MAD")
print(f"Medications with 70% reimbursement: {sum(1 for m in medications_cnss if m['taux_remb'] == 70)}")
print(f"Medications with 90% reimbursement: {sum(1 for m in medications_cnss if m['taux_remb'] == 90)}")
print(f"Medications with 0% reimbursement: {sum(1 for m in medications_cnss if m['taux_remb'] == 0)}")

# Compare with CNOPS rates
print("\n=== Comparison: CNSS vs CNOPS ===")
upgraded_to_90 = sum(1 for m in medications_cnss if m['taux_remb'] == 90 and m['cnops_taux_remb'] < 90)
print(f"Medications upgraded to 90%: {upgraded_to_90}")
print(f"Average CNSS reimbursement: {sum(m['reimbursement_amount'] for m in medications_cnss) / len([m for m in medications_cnss if m['taux_remb'] > 0]):.2f} MAD")

# Show sample medications
print("\n=== Sample CNSS Medications ===")
for i, med in enumerate(medications_cnss[:5]):
    print(f"\n{i+1}. {med['name']}")
    print(f"   DCI: {med['dci']}")
    print(f"   PPV: {med['ppv']} MAD")
    print(f"   CNOPS rate: {med['cnops_taux_remb']}% → CNSS rate: {med['taux_remb']}%")
    print(f"   Reimbursement: {med['reimbursement_amount']} MAD")
    print(f"   Patient pays: {med['patient_pays']} MAD")

print("\n✓ CNSS database created successfully!")
