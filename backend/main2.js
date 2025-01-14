const idClasse = process.argv[2]; // 2 = primer argumento después de "node tuScript.js"
if (!idClasse) {
  console.error("Debes indicar un id_classe, por ejemplo: node tuScript.js 123");
  process.exit(1);
}

const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tr6'
  });

  // Categorías a procesar (12), sin signos + o -:
  const categories = [
    'soc_POS', 'soc_NEG', 'ar_i', 'pros', 'af', 
    'ar_d', 'pros_2', 'av', 'vf', 'vv', 
    'vr', 'amics'
  ];

   // Generamos las categorías normalizadas
   const normalizedCategories = categories.map(cat => cat + "_norm");

  try {
  
  /* ESTO LO HACEMOS UNA VEZ PARA CREAR LA TABLA respostes_processades
    COMO YA TENGO LOS DATOS EN LA TABLA respostes, NO ES NECESARIO VOLVER A HACERLO
  */
    // Obtenemos todas las respuestas
      const [rows] = await connection.execute(
      'SELECT * FROM respostes WHERE id_classe = ?',
      [idClasse]
    );
    // Estructura intermedia: 
    // Key: `${id_classe}-${id_alumne}`, Value: { id_classe, id_alumne, soc_POS, soc_NEG, ... }
    const acumulados = {};

    for (const row of rows) {
      const id_classe = row.id_classe;
      const id_alumne = row.id_alumne;
      
      // Por cada una de las 12 categorías, tenemos 3 columnas: cat_1, cat_2, cat_3
      for (const cat of categories) {
        for (let i = 1; i <= 3; i++) {
          const colName = `${cat}_${i}`;
          const votado = row[colName];
          if (votado && Number.isInteger(votado)) {
            const key = `${id_classe}-${votado}`;
            if (!acumulados[key]) {
              acumulados[key] = {
                id_classe: id_classe,
                id_alumne: votado,
                soc_POS: 0,
                soc_NEG: 0,
                ar_i: 0,
                pros: 0,
                af: 0,
                ar_d: 0,
                pros_2: 0,
                av: 0,
                vf: 0,
                vv: 0,
                vr: 0,
                amics: 0
              };
            }
            // Incrementamos la categoría correspondiente
            acumulados[key][cat] += 1;
          }
        }
      }
    }

    // Ahora volcamos acumulados en la tabla respostes_processades
    for (const key in acumulados) {
      const data = acumulados[key];
      // Verificamos si ya existe el registro en respostes_processades
      const idAlumno = data.id_alumne !== undefined ? data.id_alumne : null;
      const idClasseFinal = idClasse !== undefined ? idClasse : null;
      
      // Usar estos valores en la consulta
      const [exist] = await connection.execute(
        'SELECT COUNT(*) as cnt FROM respostes_processades WHERE id_classe = ? AND id_alumne = ?',
        [idClasseFinal, idAlumno]
      );
      
      const existeRegistro = exist[0].cnt > 0;

      if (existeRegistro) {
        // Hacemos un UPDATE
        await connection.execute(
          `UPDATE respostes_processades SET 
            soc_POS = soc_POS + ?, 
            soc_NEG = soc_NEG + ?, 
            ar_i = ar_i + ?, 
            pros = pros + ?, 
            af = af + ?, 
            ar_d = ar_d + ?, 
            pros_2 = pros_2 + ?, 
            av = av + ?, 
            vf = vf + ?, 
            vv = vv + ?, 
            vr = vr + ?, 
            amics = amics + ?
           WHERE id_classe = ? AND id_alumne = ?`,
          [
            data.soc_POS, data.soc_NEG, data.ar_i, data.pros, data.af,
            data.ar_d, data.pros_2, data.av, data.vf, data.vv,
            data.vr, data.amics,
            idClasse, data.id_alumne
          ]
        );
      } else {
        // Hacemos un INSERT
        await connection.execute(
          `INSERT INTO respostes_processades (
            id_classe, id_alumne, nom_alumne,
            soc_POS, soc_NEG, ar_i, pros, af, ar_d, 
            pros_2, av, vf, vv, vr, amics
          ) VALUES (?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            idClasse, data.id_alumne,
            data.soc_POS, data.soc_NEG, data.ar_i, data.pros, data.af,
            data.ar_d, data.pros_2, data.av, data.vf, data.vv,
            data.vr, data.amics
          ]
        );
      }
    }


    console.log('Traspaso y acumulación completados con éxito.');


      // --- PROCESO PARA CALCULAR MEDIA Y DESVIACIÓN ESTÁNDAR ---
      const [procesadas] = await connection.execute('SELECT * FROM respostes_processades');

      const tabla = {};
      const valoresPorColumna = {};
      for (const cat of categories) {
        valoresPorColumna[cat] = [];
      }
  
      // Rellenamos la tabla con los datos de cada alumno
      for (const fila of procesadas) {
        const idAlum = fila.id_alumne.toString();
        tabla[idAlum] = {};
        for (const cat of categories) {
          const valor = fila[cat];
          tabla[idAlum][cat] = valor;
          valoresPorColumna[cat].push(valor);
        }
      }
  
      // Calculamos la media por categoría
      const medias = {};
      for (const cat of categories) {
        const arr = valoresPorColumna[cat];
        const sum = arr.reduce((a, b) => a + b, 0);
        const mean = sum / arr.length;
        medias[cat] = mean;
      }
  
      // Calculamos la desviación estándar por categoría
      const desv = {};
      for (const cat of categories) {
        const arr = valoresPorColumna[cat];
        const mean = medias[cat];
        const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
        const std = Math.sqrt(variance);
        desv[cat] = std;
      }
  
      // Añadimos las filas "media" y "desv" a la tabla
      tabla["media"] = {};
      tabla["desv"] = {};
      for (const cat of categories) {
        tabla["media"][cat] = medias[cat];
        tabla["desv"][cat] = desv[cat];
      }
  
      // --- NORMALIZACIÓN ---
      // Añadimos las columnas normalizadas
      for (const filaId in tabla) {
        if (filaId !== "media" && filaId !== "desv") {
          // Fila de alumno
          for (const cat of categories) {
            const valor = tabla[filaId][cat];
            const mean = tabla["media"][cat];
            const std = tabla["desv"][cat];
            let normVal = 0;
            if (std !== 0) {
              normVal = (valor - mean) / std;
            }
            // Usamos la categoría normalizada de normalizedCategories
            const normCat = cat + "_norm";
            tabla[filaId][normCat] = normVal;
          }
        } else {
          // Fila de media y desv
          for (const cat of categories) {
            const normCat = cat + "_norm";
            if (filaId === "media") {
              // media normalizada = 0
              tabla["media"][normCat] = 0;
            } else if (filaId === "desv") {
              // desv normalizada = 1
              tabla["desv"][normCat] = 1;
            }
          }
        }
      }
  
      

      // Añadimos las nuevas columnas solicitadas:
// Impac (soc_POS + soc_NEG), Prefer (soc_POS - soc_NEG)

const impacArr = [];
const preferArr = [];

for (const filaId in tabla) {
  if (filaId !== "media" && filaId !== "desv") {
    const sp = tabla[filaId].soc_POS;
    const sn = tabla[filaId].soc_NEG;
    const impac = sp + sn;
    const prefer = sp - sn;
    tabla[filaId].Impac = impac;
    tabla[filaId].Prefer = prefer;
    impacArr.push(impac);
    preferArr.push(prefer);
  }
}

// Función auxiliar para calcular media y desviación
function calcMediaDesv(arr) {
  const sum = arr.reduce((a,b) => a+b,0);
  const mean = sum / arr.length;
  const variance = arr.reduce((acc,val)=> acc+Math.pow(val-mean,2), 0) / arr.length;
  const std = Math.sqrt(variance);
  return {mean, std};
}

// Calculamos media y desv para Impac y Prefer
const impacStats = calcMediaDesv(impacArr);
const preferStats = calcMediaDesv(preferArr);

// Asignamos estas estadísticas a la fila media y desv
tabla["media"].Impac = impacStats.mean;
tabla["desv"].Impac = impacStats.std;
tabla["media"].Prefer = preferStats.mean;
tabla["desv"].Prefer = preferStats.std;

// Ahora calculamos Z_Soc_POS, Z_Soc_NEG, Z_Impac, Z_Prefer
for (const filaId in tabla) {
  if (filaId !== "media" && filaId !== "desv") {
    // Z_Soc_POS
    const sp = tabla[filaId].soc_POS;
    const mean_sp = tabla["media"].soc_POS;
    const std_sp = tabla["desv"].soc_POS;
    tabla[filaId].Z_Soc_POS = std_sp !== 0 ? (sp - mean_sp) / std_sp : 0;

    // Z_Soc_NEG
    const sn = tabla[filaId].soc_NEG;
    const mean_sn = tabla["media"].soc_NEG;
    const std_sn = tabla["desv"].soc_NEG;
    tabla[filaId].Z_Soc_NEG = std_sn !== 0 ? (sn - mean_sn) / std_sn : 0;

    // Z_Impac
    const impac = tabla[filaId].Impac;
    const mean_i = tabla["media"].Impac;
    const std_i = tabla["desv"].Impac;
    tabla[filaId].Z_Impac = std_i !== 0 ? (impac - mean_i) / std_i : 0;

    // Z_Prefer
    const prefer = tabla[filaId].Prefer;
    const mean_p = tabla["media"].Prefer;
    const std_p = tabla["desv"].Prefer;
    tabla[filaId].Z_Prefer = std_p !== 0 ? (prefer - mean_p) / std_p : 0;
  } else {
    // Para media y desv
    // Dejamos los Z_ en 0 para media y 1 para desv, o simplemente 0.
    // Aquí: media = 0, desv = 1
    if (filaId === "media") {
      tabla["media"].Z_Soc_POS = 0;
      tabla["media"].Z_Soc_NEG = 0;
      tabla["media"].Z_Impac = 0;
      tabla["media"].Z_Prefer = 0;
    } else if (filaId === "desv") {
      tabla["desv"].Z_Soc_POS = 1;
      tabla["desv"].Z_Soc_NEG = 1;
      tabla["desv"].Z_Impac = 1;
      tabla["desv"].Z_Prefer = 1;
    }
  }
}

// Columnas nuevas a mostrar
const newColumns = ['Z_Soc_POS', 'Z_Soc_NEG', 'Impac', 'Prefer', 'Z_Impac', 'Z_Prefer'];

// Combinar las columnas originales con las nuevas, si lo deseas
// Orden sugerido: primero las originales, luego las nuevas
const allColumns = [...categories,...normalizedCategories, ...newColumns];


// Función auxiliar para calcular media y desviación estándar si no la tienes ya
function calcMediaDesv(arr) {
    const sum = arr.reduce((a,b)=>a+b,0);
    const mean = sum / arr.length;
    const variance = arr.reduce((acc,val)=>acc+Math.pow(val-mean,2),0)/arr.length;
    const std = Math.sqrt(variance);
    return {mean, std};
  }
  
  // Arrays para almacenar valores y poder calcular media y desv
  const arrAR = [];
  const arrTotA = [];
  const arrPros = [];
  const arrTotV = [];
  
  // Calculamos AR, TotA, Pros, TotV para cada alumno
  for (const filaId in tabla) {
    if (filaId !== "media" && filaId !== "desv") {
      const ar_i = tabla[filaId].ar_i;
      const ar_d = tabla[filaId].ar_d;
      const af = tabla[filaId].af;
      const av = tabla[filaId].av;
      const pros = tabla[filaId].pros;
      const pros_2 = tabla[filaId].pros_2;
      const vf = tabla[filaId].vf;
      const vv = tabla[filaId].vv;
      const vr = tabla[filaId].vr;
  
      const AR = ar_i + ar_d;
      const TotA = (ar_i + ar_d) / (2 + af + av);
      const Pros = pros + pros_2;
      const TotV = vf + vv + vr;
  
      tabla[filaId].AR = AR;
      tabla[filaId].TotA = TotA;
      tabla[filaId].Pros = Pros;
      tabla[filaId].TotV = TotV;
  
      arrAR.push(AR);
      arrTotA.push(TotA);
      arrPros.push(Pros);
      arrTotV.push(TotV);
    }
  }
  
  // Calculamos media y desv de AR, TotA, Pros, TotV
  const ARStats = calcMediaDesv(arrAR);
  const TotAStats = calcMediaDesv(arrTotA);
  const ProsStats = calcMediaDesv(arrPros);
  const TotVStats = calcMediaDesv(arrTotV);
  
  // Asignamos estas estadísticas a la fila "media" y "desv"
  tabla["media"].AR = ARStats.mean;
  tabla["desv"].AR = ARStats.std;
  
  tabla["media"].TotA = TotAStats.mean;
  tabla["desv"].TotA = TotAStats.std;
  
  tabla["media"].Pros = ProsStats.mean;
  tabla["desv"].Pros = ProsStats.std;
  
  tabla["media"].TotV = TotVStats.mean;
  tabla["desv"].TotV = TotVStats.std;
  
  // Ahora calculamos las normalizaciones ZAR, ZTotA, ZPros, ZTotV
  for (const filaId in tabla) {
    if (filaId !== "media" && filaId !== "desv") {
      const AR = tabla[filaId].AR;
      const mean_AR = tabla["media"].AR;
      const std_AR = tabla["desv"].AR;
      tabla[filaId].ZAR = std_AR !== 0 ? (AR - mean_AR) / std_AR : 0;
  
      const TotA = tabla[filaId].TotA;
      const mean_TotA = tabla["media"].TotA;
      const std_TotA = tabla["desv"].TotA;
      tabla[filaId].ZTotA = std_TotA !== 0 ? (TotA - mean_TotA) / std_TotA : 0;
  
      const Pros = tabla[filaId].Pros;
      const mean_Pros = tabla["media"].Pros;
      const std_Pros = tabla["desv"].Pros;
      tabla[filaId].ZPros = std_Pros !== 0 ? (Pros - mean_Pros) / std_Pros : 0;
  
      const TotV = tabla[filaId].TotV;
      const mean_TotV = tabla["media"].TotV;
      const std_TotV = tabla["desv"].TotV;
      tabla[filaId].ZTotV = std_TotV !== 0 ? (TotV - mean_TotV) / std_TotV : 0;
    } else {
      // Para la fila media y desv de las Z:
      // media -> 0, desv -> 1
      if (filaId === "media") {
        tabla["media"].ZAR = 0;
        tabla["media"].ZTotA = 0;
        tabla["media"].ZPros = 0;
        tabla["media"].ZTotV = 0;
      } else {
        tabla["desv"].ZAR = 1;
        tabla["desv"].ZTotA = 1;
        tabla["desv"].ZPros = 1;
        tabla["desv"].ZTotV = 1;
      }
    }
  }
  
  console.table(tabla);

  // Nuevas columnas a añadir en esta etapa:
  const newColumns6 = ["AR", "ZAR", "TotA", "ZTotA", "Pros", "ZPros", "TotV", "ZTotV"];
  
  // Suponemos que antes ya tenías 'finalColumns' o 'columnasAcumuladas' con las columnas anteriores.
  // Aquí, por claridad, concatenamos estas nuevas columnas al final.
  // Ajusta según el nombre de tu variable de columnas acumuladas si es necesario.
  // Si no tienes una variable mantenida, puedes crear una con las columnas previas y concatenar estas nuevas.
  //const finalColumnsExtended = finalColumns.concat(newColumns6);
  
  console.log("Nuevas columnas AR, ZAR, TotA, ZTotA, Pros, ZPros, TotV, ZTotV calculadas.");
  //imprimirTabla(tabla, finalColumnsExtended);
  
    for (const filaId in tabla) {
      if (filaId !== "media" && filaId !== "desv") {
        const ZSocPos = tabla[filaId].Z_soc_POS;
        const ZSocNeg = tabla[filaId].Z_soc_NEG;
        const ZImpac = tabla[filaId].Z_Impac;
        const ZPrefer = tabla[filaId].Z_Prefer;
    
        let Popular = 0;
        if (ZPrefer > -1) Popular++;
        if (ZSocPos > 0) Popular++;
        if (ZSocNeg < 0) Popular++;
    
        let Rebutjat = 0;
        if (ZPrefer < -1) Rebutjat++;
        if (ZSocNeg > 0) Rebutjat++;
        if (ZSocPos < 0) Rebutjat++;
    
        let Ignorat = 0;
        if (ZImpac < -1) Ignorat++;
        if (ZSocNeg < 0) Ignorat++;
        if (ZSocPos < 0) Ignorat++;
    
        let Controvertit = 0;
        if (ZImpac > 1) Controvertit++;
        if (ZSocPos > 0) Controvertit++;
        if (ZSocNeg > 0) Controvertit++;
    
        let Normal = 0;
        // Se asume que "ZSoc > 0.5" fue un error tipográfico y se refería a ZSoc+
        // Las condiciones de Normal parecen simétricas a las otras:
        // si ZSoc+ < -0.5
        // si ZSoc+ > 0.5
        // si ZSoc- < -0.5
        // si ZSoc- > 0.5
        if (ZSocPos < -0.5) Normal++;
        if (ZSocPos > 0.5) Normal++;
        if (ZSocNeg < -0.5) Normal++;
        if (ZSocNeg > 0.5) Normal++;
    
        tabla[filaId].Popular = Popular;
        tabla[filaId].Rebutjat = Rebutjat;
        tabla[filaId].Ignorat = Ignorat;
        tabla[filaId].Controvertit = Controvertit;
        tabla[filaId].Normal = Normal;
    
      } else {
        // Para "media" y "desv" asignamos 0 (no tiene sentido estadístico)
        tabla[filaId].Popular = 0;
        tabla[filaId].Rebutjat = 0;
        tabla[filaId].Ignorat = 0;
        tabla[filaId].Controvertit = 0;
        tabla[filaId].Normal = 0;
      }
    }
    
    // Agregamos estas columnas a la lista final de columnas.
    // Suponemos que 'finalColumnsExtended' es la lista de columnas tras el último paso.
    // Si es otra variable, ajústalo. Si no tienes esta variable, crea una lista con las columnas previas.
    const newColumns5 = ["Popular", "Rebutjat", "Ignorat", "Controvertit", "Normal"];
    //const finalColumnsExtended2 = finalColumnsExtended.concat(newColumns2);
    
    console.log("Nuevas columnas Popular, Rebutjat, Ignorat, Controvertit, Normal calculadas.");



/*********************************************
 * FRAGMENTO DE CÓDIGO PARA AÑADIR AL FINAL
 *********************************************/

// Suponemos que ya tienes:
// - La variable `tabla` con todas las filas (incluyendo 'media' y 'desv').
// - Cada fila de alumno tiene campos como: pros, pros_2, af, av, ar_i, ar_d, vf, vv, vr...
// - Las versiones normalizadas: Z_af, Z_av, ZAR, ZTotA, ZTotV, ZPros, etc.
// - Campos calculados: Popular, Rebutjat, Ignorat, Controvertit, Normal
// - La función imprimirTabla(tabla, columnas) o algún equivalente.

///////////////////////////
// 1) Crear array resultats
///////////////////////////
const resultats = [];

// Recorremos cada fila de `tabla` (excepto 'media' y 'desv') para construir la fila de resultados
for (const filaId in tabla) {
  if (filaId !== "media" && filaId !== "desv") {
    const row = tabla[filaId];

    // --- 1. Identificadores
    // Ajusta si en tu 'tabla' estos campos se llaman diferente o si provienen de otra parte
    //const id_classe = row.id_classe || 1; // ejemplo: 1
    const id_classe = idClasse; // ejemplo: 1
    
    const id_alumne   = row.id_alumne   || parseInt(filaId);

    // --- 2. Cálculos solicitados

    // totalAgressivitat = (pros + pros2) / (2 + AF + AV)
    const totalAgressivitat = (row.pros + row.pros_2) / (2 + row.af + row.av);

    // agressivitatFisica = AF
    const agressivitatFisica = row.af;

    // agressivitatVerbal = AV
    const agressivitatVerbal = row.av;

    // agressivitatRelacional = (ar_i + ar_d) / 2
    const agressivitatRelacional = (row.ar_i + row.ar_d) / 2;

    // totalAgressivitat_SN = "X" si ZTotA > 1, sino " "
    const totalAgressivitat_SN = (row.ZTotA && row.ZTotA > 1) ? "X" : " ";

    // agressivitatFisica_SN = "X" si AF_norm > 1, sino " "
    // Suponemos que AF_norm es row.Z_af
    const agressivitatFisica_SN = (row.Z_af && row.Z_af > 1) ? "X" : " ";

    // agressivitatVerbal_SN = "X" si AV_norm > 1, sino " "
    // Suponemos que AV_norm es row.Z_av
    const agressivitatVerbal_SN = (row.Z_av && row.Z_av > 1) ? "X" : " ";

    // agressivitatRelacional_SN = "X" si ZAR > 1, sino " "
    const agressivitatRelacional_SN = (row.ZAR && row.ZAR > 1) ? "X" : " ";

    // prosocialitat = (pros + pros2) / 2
    const prosocialitat = (row.pros + row.pros_2) / 2;

    // prosocialitat_SN = "X" si ZPros > 1, sino " "
    // Suponemos que su normalización está en row.ZPros
    const prosocialitat_SN = (row.ZPros && row.ZPros > 1) ? "X" : " ";

    // totalVictimitzacio = VF + VV + VR
    const totalVictimitzacio = row.vf + row.vv + row.vr;

    // victimitzacioFisica = VF
    const victimitzacioFisica = row.vf;

    // victimitzacioVerbal = VV
    const victimitzacioVerbal = row.vv;

    // victimitzacioRelacional = VR
    const victimitzacioRelacional = row.vr;

    // totalVictimitzacio_SN = "X" si ZTotV > 1, sino " "
    const totalVictimitzacio_SN = (row.ZTotV && row.ZTotV > 1) ? "X" : " ";

    // victimitzacioFisica_SN = "X" si VF_norm > 1, sino " "
    // Suponemos que VF_norm sea row.Z_vf
    const victimitzacioFisica_SN = (row.Z_vf && row.Z_vf > 1) ? "X" : " ";

    // victimitzacioVerbal_SN = "X" si VV_norm > 1, sino " "
    // Suponemos que VV_norm sea row.Z_vv
    const victimitzacioVerbal_SN = (row.Z_vv && row.Z_vv > 1) ? "X" : " ";

    // victimitzacioRelacional_SN = "X" si VR_norm > 1, sino " "
    // Suponemos que VR_norm sea row.Z_vr
    const victimitzacioRelacional_SN = (row.Z_vr && row.Z_vr > 1) ? "X" : " ";

    // popular_SN = "X" si Popular = 3, sino " "
    const popular_SN = (row.Popular === 3) ? "X" : " ";

    // rebutjat_SN = "X" si Rebutjat = 3, sino " "
    const rebutjat_SN = (row.Rebutjat === 3) ? "X" : " ";

    // ignorat_SN = "X" si Ignorat = 3, sino " "
    const ignorat_SN = (row.Ignorat === 3) ? "X" : " ";

    // controvertit_SN = "X" si Controvertit = 3, sino " "
    const controvertit_SN = (row.Controvertit === 3) ? "X" : " ";

    // normal_SN = "X" si Normal = 0, sino " "
    // (recuerda que cambiaste norma_SN a normal_SN)
    const normal_SN = (row.Normal === 0) ? "X" : " ";

    // triesPositives = soc_POS (numérico)
    const triesPositives = row.soc_POS;

    // triesNegatives = soc_NEG (numérico)
    const triesNegatives = row.soc_NEG;

    // --- 3. Guardamos en el array resultats
    resultats.push({
      id_classe,
      id_alumne,

      totalAgressivitat,
      agressivitatFisica,
      agressivitatVerbal,
      agressivitatRelacional,
      totalAgressivitat_SN,
      agressivitatFisica_SN,
      agressivitatVerbal_SN,
      agressivitatRelacional_SN,
      
      prosocialitat,
      prosocialitat_SN,
      
      totalVictimitzacio,
      victimitzacioFisica,
      victimitzacioVerbal,
      victimitzacioRelacional,
      totalVictimitzacio_SN,
      victimitzacioFisica_SN,
      victimitzacioVerbal_SN,
      victimitzacioRelacional_SN,
      
      popular_SN,
      rebutjat_SN,
      ignorat_SN,
      controvertit_SN,
      normal_SN,
      
      triesPositives,
      triesNegatives
    });
  }
}

// (Opcional) Mostrar el array resultats por consola para verificar
console.log("RESULTATS FINALES:", resultats);

/*******************************************************
 * 2) INSERTAR/ACTUALIZAR EN LA TABLA `resultats` (SQL)
 *******************************************************/

// Supón que sigues teniendo tu conexión MySQL abierta en la variable `connection`
// y que ya creaste la tabla `resultats` con la sentencia CREATE TABLE anterior.
// Aquí hacemos un simple INSERT con la cláusula ON DUPLICATE KEY UPDATE
// para que, si ya existe la fila para (id_classe, id_alumne), la actualice.
async function volcarEnTablaResultats() {
  for (const r of resultats) {
    // Ajusta según la estructura de tu tabla:
    const sql = `
      INSERT INTO resultats (
        id_classe, id_alumne,
        totalAgressivitat,
        agressivitatFisica, agressivitatVerbal, agressivitatRelacional,
        totalAgressivitat_SN,
        agressivitatFisica_SN, agressivitatVerbal_SN, agressivitatRelacional_SN,
        prosocialitat,
        prosocialitat_SN,
        totalVictimitzacio,
        victimitzacioFisica, victimitzacioVerbal, victimitzacioRelacional,
        totalVictimitzacio_SN,
        victimitzacioFisica_SN, victimitzacioVerbal_SN, victimitzacioRelacional_SN,
        popular_SN, rebutjat_SN, ignorat_SN, controvertit_SN, normal_SN,
        triesPositives, triesNegatives
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        totalAgressivitat = VALUES(totalAgressivitat),
        agressivitatFisica = VALUES(agressivitatFisica),
        agressivitatVerbal = VALUES(agressivitatVerbal),
        agressivitatRelacional = VALUES(agressivitatRelacional),
        totalAgressivitat_SN = VALUES(totalAgressivitat_SN),
        agressivitatFisica_SN = VALUES(agressivitatFisica_SN),
        agressivitatVerbal_SN = VALUES(agressivitatVerbal_SN),
        agressivitatRelacional_SN = VALUES(agressivitatRelacional_SN),
        prosocialitat = VALUES(prosocialitat),
        prosocialitat_SN = VALUES(prosocialitat_SN),
        totalVictimitzacio = VALUES(totalVictimitzacio),
        victimitzacioFisica = VALUES(victimitzacioFisica),
        victimitzacioVerbal = VALUES(victimitzacioVerbal),
        victimitzacioRelacional = VALUES(victimitzacioRelacional),
        totalVictimitzacio_SN = VALUES(totalVictimitzacio_SN),
        victimitzacioFisica_SN = VALUES(victimitzacioFisica_SN),
        victimitzacioVerbal_SN = VALUES(victimitzacioVerbal_SN),
        victimitzacioRelacional_SN = VALUES(victimitzacioRelacional_SN),
        popular_SN = VALUES(popular_SN),
        rebutjat_SN = VALUES(rebutjat_SN),
        ignorat_SN = VALUES(ignorat_SN),
        controvertit_SN = VALUES(controvertit_SN),
        normal_SN = VALUES(normal_SN),
        triesPositives = VALUES(triesPositives),
        triesNegatives = VALUES(triesNegatives)
    `;

    const params = [
      r.id_classe,
      r.id_alumne,
      r.totalAgressivitat,
      r.agressivitatFisica,
      r.agressivitatVerbal,
      r.agressivitatRelacional,
      r.totalAgressivitat_SN,
      r.agressivitatFisica_SN,
      r.agressivitatVerbal_SN,
      r.agressivitatRelacional_SN,
      r.prosocialitat,
      r.prosocialitat_SN,
      r.totalVictimitzacio,
      r.victimitzacioFisica,
      r.victimitzacioVerbal,
      r.victimitzacioRelacional,
      r.totalVictimitzacio_SN,
      r.victimitzacioFisica_SN,
      r.victimitzacioVerbal_SN,
      r.victimitzacioRelacional_SN,
      r.popular_SN,
      r.rebutjat_SN,
      r.ignorat_SN,
      r.controvertit_SN,
      r.normal_SN,
      r.triesPositives,
      r.triesNegatives
    ];

    // Ejecutamos la sentencia
    await connection.execute(sql, params);
  }
  console.log("Datos volcados en la tabla `resultats` correctamente.");
}

// Llamar a la función (usa 'await' si estás en una función async)
await volcarEnTablaResultats();

// --- FIN DEL NUEVO CÓDIGO ---
 //   imprimirTabla(tabla, finalColumnsExtended2);

    
// Convertimos a un array para console.table
const rowsToPrint = [];
for (const filaId in tabla) {
  const rowObj = { id: filaId };
  // Formatear todas las columnas
  for (const cat of categories) {
    rowObj[cat] = tabla[filaId][cat].toFixed(2);
  }
  for (const cat of normalizedCategories) {
    rowObj[cat] = tabla[filaId][cat].toFixed(2);
  }
  for (const nc of newColumns) {
    rowObj[nc] = tabla[filaId][nc].toFixed(2);
  }
  for (const nc of newColumns6) {
    rowObj[nc] = tabla[filaId][nc].toFixed(2);
  }
  for (const nc of newColumns5) {
    rowObj[nc] = tabla[filaId][nc].toFixed(2);
  }
  rowsToPrint.push(rowObj);
}

console.table(rowsToPrint); 
    console.log('Proceso completado con éxito.');
  } catch (error) {
    console.error('Error durante el proceso:', error);
  } finally {
    await connection.end();
  }
}

main();