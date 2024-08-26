import sql from 'mssql';

const dbSettings = {
    user: "sa",
    password: "123",
    server: "Andrey\\SQLEXPRESS",
    database: "SweetCol",
    port: 1458,
    options: {
        encrypt: true,
        trustServerCertificate: true
    },

}


export const getConnection = async () => {
    try {

       
        const pool = await sql.connect(dbSettings);
        return pool
        
    } catch (error) {
        console.log(error)
    }
}