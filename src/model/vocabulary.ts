import { Vocabulary } from './../types/vocabularyType';
import { OkPacket, RowDataPacket } from "mysql2";
import {query} from "../config/conectMysql"

export async function create(vocabulary: Vocabulary) {
    const sql: string = `INSERT INTO vocabulary (name, type_id, meaning, sound) VALUES ('${vocabulary.name}', ${vocabulary.type_id}, '${vocabulary.meaning}', '${vocabulary.sound}' );`
    const result: OkPacket = await query(sql,null) as OkPacket;
    return result.affectedRows;
}

export async function findAll() {
    const sql: string = `SELECT * FROM vocabulary`
    const result: RowDataPacket[] = await query(sql,null) as RowDataPacket[];
    return result;
}

export async function findAllPagination(index: number, size: number, search: string) {
    const sql: string = `SELECT v.*, t.abbreviation FROM vocabulary v LEFT JOIN type t on v.type_id = t.id WHERE v.name LIKE '%${search}%' ORDER BY v.id DESC LIMIT ?,?`
    const sqlCount: string = `SELECT COUNT(*) as count FROM vocabulary v LEFT JOIN type t on v.type_id = t.id WHERE v.name LIKE '%${search}%'`
    const rowList: RowDataPacket[] = await query(sql,[index, size]) as RowDataPacket[];
    const rowCount: RowDataPacket[] = await query(sqlCount,[index, size]) as RowDataPacket[];
    const result = {
        data: rowList,
        total_data: (rowCount.length > 0) ? rowCount[0].count : 0,
        total_pages: (rowCount.length > 0) ? Math.ceil(rowCount[0].count / size) : 0
    }
    return result;
}

export async function findById(id: number) {
    const sql: string = `SELECT * FROM vocabulary WHERE id = :id`;
    const result: RowDataPacket[] = await query(sql,{"id": id}) as RowDataPacket[];
    return result;
}

export async function deleteById(id: number) {
    const sql: string = `DELETE FROM vocabulary WHERE id = ${id};`
    const result: OkPacket = await query(sql,null) as OkPacket;
    return result.affectedRows;
}

export async function updateById(id: number, vocabulary: Vocabulary) {
    const sql: string = `UPDATE vocabulary SET name = '${vocabulary.name}', type_id =  '${vocabulary.type_id}', meaning = '${vocabulary.meaning}', sound = '${vocabulary.sound}' WHERE id = ${id};`
    const result: OkPacket = await query(sql,null) as OkPacket;
    return result.affectedRows;
}

export async function random() {
    const sql: string = `SELECT v.*, y.abbreviation FROM vocabulary v LEFT JOIN type y on v.type_id = y.id ORDER BY RAND() LIMIT 0,12;`
    const result: RowDataPacket[] = await query(sql,null) as RowDataPacket[];
    return result;
}

export async function checkName(name: string) {
    const sql: string = `SELECT * FROM vocabulary v WHERE v.name = ?;`
    console.log(name)
    console.log(sql)
    const result: RowDataPacket[] = await query(sql,[name]) as RowDataPacket[];
    return result;
}

