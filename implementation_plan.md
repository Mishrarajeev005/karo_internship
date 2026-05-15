# Implementation Plan: KaroStartup Partner Platform (Multi-Tenant)

Is plan ka maqsad KaroStartup ko ek bada platform banana hai jaha 100+ partner companies (jaise TechFlit, EduVibe) apna khud ka dashboard chala sakein.

## 1. Vision & Architecture (Kaise kaam karega?)
Hume har company ke liye alag-alag page banane ki zaroorat nahi hai. Hum ek **"Smart Dynamic System"** banayenge.
- **Ek hi Codebase**: Frontend aur Backend ek hi rahega.
- **Dynamic Data**: Jo login karega, usey sirf apna data dikhega.
- **Data Privacy**: TechFlit ka data koi aur company nahi dekh payegi. Sab kuch database mein `company_id` se alag rahega.

---

## 2. Roles & Permissions (Kiske paas kya power hogi?)

### **Super Admin (Aap - KaroStartup Owner)**
- **Role**: `SUPER_ADMIN`
- **Powers**:
    - Nayi partner companies ko **Add** ya **Remove** karna.
    - Saari companies ka data ek sath dekhna (Master View).
    - Platform ki overall settings control karna.

### **Company Admin (Partners - e.g. TechFlit)**
- **Role**: `COMPANY_ADMIN`
- **Powers**:
    - Apna khud ka Login (Email/Password).
    - Dashboard par sirf apni internships aur applicants dekhna.
    - Nayi internship post karna (Jo automatically unke naam se dikhegi).
    - Apne candidates ki Excel report download karna.

---

## 3. Database Updates (Backend mein kya badlega?)

### **Naya Table: Company**
Isme partners ki details hongi:
- Company Name, Login Email, Encrypted Password, Logo, aur Status (Active/Block).

### **Internships & Applications**
In dono tables mein hum ek `company_id` column add karenge. Isse system ko pata chalega ki kaun si internship kis company ki hai.

---

## 4. Main Features (Jo hum banayenge)

### **A. Partner Management (Sirf Aapke liye)**
Aapke dashboard mein ek naya tab hoga jaha se aap 1-click mein nayi company create kar sakenge aur unhe login ID/Password de sakenge.

### **B. Smart Filter Logic**
Backend mein aisi setting hogi ki agar TechFlit login hai, toh database usey sirf wahi data dega jisme `company_id = TechFlit_ID` ho.

### **C. Personalized Dashboard**
Login karte hi dashboard par likha aayega: **"Welcome, TechFlit"**. Saare stats aur tables unke hisab se update ho jayenge.

---

## 5. Kaam Kaise Shuru Hoga? (Next Steps)

1. **Step 1 (Backend)**: Database mein `Company` table banana aur purane data ko link karna.
2. **Step 2 (Login)**: Login page ko update karna taki wo partners ko pehchan sake.
3. **Step 3 (Super Admin UI)**: Aapke liye partners ko manage karne ka interface banana.
4. **Step 4 (Dashboard Fix)**: Dashboard ko dynamic banana taki wo logged-in company ka data dikhaye.

---

## Verification (Check kaise karenge?)
- Main TechFlit ban kar login karunga aur check karunga ki mujhe kisi aur ka data toh nahi dikh raha.
- Aap Super Admin ban kar check karenge ki aap sab kuch control kar paa rahe hain ya nahi.
