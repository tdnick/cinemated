// Singleton class

class dbHandler {
    constructor() {
        if (!dbHandler.instance) {
            return dbHandler.instance;
        }

        dbHandler.instance = this;
        return this;
    }

    getUser() {
        return "SELECT * FROM users WHERE username = :name";
    }

    getLimitless() {
        return "SELECT l.limitless_id, l.user_id, l.last_name, l.first_name, l.email, l.type, l.phone_number, l.start_date, l.end_date " +
        "FROM users u JOIN limitless l ON (u.user_id = l.user_id) WHERE l.limitless_id = (SELECT MAX(limitless_id) FROM limitless WHERE user_id IN " +
        "(SELECT user_id FROM users WHERE username = :name))";
    }

    insertIntoLimitless() {
        return "INSERT INTO limitless (limitless_id, user_id, last_name, first_name, email, type, phone_number, start_date, end_date)" + 
        "VALUES(1 + (SELECT MAX(limitless_id) FROM limitless), :userId, :lastName, :firtstName, :email, :typeOfCard, :phoneNumber, TO_DATE(:startDate, 'dd-mm-yyyy'), " +
        "TO_DATE(:endDate, 'dd-mm-yyyy'))";
    }

    insertIntoRecenzii() {
        return "INSERT INTO recenzii (recenzie_id, stars, data_recenzie, user_id, film_id, mesaj)" +
        "VALUES( (SELECT count(*) FROM recenzii) + 1, :stars, TO_CHAR(SYSDATE, 'DD-MON-YYYY HH:MI:SS'), :userId, :idFilm, :mesaj)";
    }

    insertIntoFilme() {
        return "INSERT INTO filme (film_id, nume_film, gen_film, regizori, actori, link_trailer, link_afis, descriere, durata, limba_originala, an_aparitie)" +
                " VALUES (1 + (SELECT count(film_id) FROM filme), :title, :genre, :director, :actor, :trailer, :poster, :desc, :time, :lang, :year)";
    }
    
    updateUsername() {
        return "UPDATE users SET username = :name WHERE username = :uname";
    }

    updateUserInfo() {
        return"UPDATE users SET full_name = :fname, email = :email WHERE username = :username";
    }

    updatePassword() {
        return "UPDATE users SET password = :newPassword WHERE (username = :uname AND password = :oldPassword)";
    }

    insertIntoUsers() {
        return "INSERT INTO users (username, email, password, full_name, is_admin) VALUES (:username," + 
        " :email, :encrPass, :fname, 0)";
    }

    insertIntoBilete() {
        return "INSERT INTO bilete (bilet_id, rezervare_id, nr_loc, tip_bilet, user_id, ecranizare_id, rand) VALUES (1+(SELECT MAX(bilet_id) FROM bilete), " 
        + ":rezervare_id, :loc, :t_type, :idClient, :idEcr, :rand)";
    }

    deleteFromBilete() {
        return "DELETE FROM bilete WHERE bilet_id = :id";
    }

    deleteFromUsers() {
        return "DELETE FROM users WHERE user_id = :id";
    }

    setAdmin() {
        return "UPDATE users SET is_admin = :code WHERE user_id = :id";
    }

    deleteMovie() {
        return "DELETE FROM filme WHERE film_id = :id";
    }

    getEcranizari() {
        return "SELECT * FROM ecranizari JOIN filme USING(film_id) WHERE ecranizare_id  = :id";
    }

    getLocuri() {
        return "SELECT nume_film, data, ora, sala, nr_loc, rand FROM ecranizari JOIN filme USING(film_id) LEFT JOIN bilete USING(ecranizare_id) WHERE ecranizare_id = :id";
    }

    getChoose() {
        return "SELECT * FROM limitless WHERE user_id  = :id  ORDER BY end_date DESC";
    }

    getFilm() {
        return "SELECT * FROM filme LEFT JOIN ecranizari USING(film_id) LEFT JOIN recenzii USING(film_id) LEFT JOIN users USING (user_id) WHERE film_id = :film_id ORDER BY TO_DATE(data_recenzie, 'DD-MON-YYYY HH:MI:SS') DESC";
    }

    getFilme() {
        return "SELECT * FROM filme ORDER BY film_id";
    }

    getIndex() {
        return "SELECT film_id, nume_film, link_afis, descriere, an_aparitie, NVL((SELECT AVG(stars) FROM recenzii WHERE film_id = f.film_id), 0) stars FROM filme f  ORDER BY film_id";
    }

    getAllUsers() {
        return "SELECT * FROM users order by user_id";
    }

    getDashboardTickets() {
        return "SELECT user_id, rezervare_id, bilet_id, tip_bilet, nume_film, data, ora, sala, rand, nr_loc FROM bilete JOIN ecranizari USING(ecranizare_id) JOIN filme USING(film_id) where user_id = :id order by bilet_id";
    }

    getAllMovies() {
        return "SELECT film_id, nume_film, link_afis, descriere, an_aparitie, NVL((SELECT AVG(stars) FROM recenzii WHERE film_id = f.film_id), 0) stars FROM filme f  ORDER BY film_id";
    }

}

module.exports = dbHandler;