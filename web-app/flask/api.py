# -*- coding: utf-8 -*-
from flask import Flask,flash, redirect, render_template, request, session, abort, url_for, jsonify
from flaskext.mysql import MySQL
from flask_api import FlaskAPI

import numpy as np


mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'team1305'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)
connect = mysql.connect()

cursor_user =connect.cursor()
cursor_user.execute("SELECT * from users")
data_user = cursor_user.fetchall()
# print data_user
cursor_monan = connect.cursor()
cursor_monan.execute("SELECT * from monan")
data_monan = cursor_monan.fetchall()
# print data_monan
cursor_buaan = connect.cursor()
cursor_buaan.execute("SELECT * from buaan")
data_buaan = cursor_buaan.fetchall()


@app.route('/api_get/',methods=['GET'])
def api_get():
	a = 1010101
	b = " User 1"
	c = "Foods"
	d = "Item 1:Bo"
	e = "Item 2: Trau"
	return jsonify(
		id = a,
		user = b,
		category = c,
		item_1 = d,
		item_2 = e
	)

@app.route('/api_post/',methods=['POST'])
def api_post():
	return jsonify(
		id = "1234554321",
		user_name = "Nguyen Huy Phat",
		time_click = "19:06:23",
		time_remove = "20:02:1",
		item_0 = "ga ran",
		item_1 = "ga quay",
		item_2 = "ga luoc",
		item_3 = "ca kho",
	)

@app.route('/api_get_data/user',methods=['GET'])
def api_get_data_user():
	return jsonify(data_user)

@app.route('/api_get_data/monan',methods=['GET'])
def api_get_data_monan():
	return jsonify(data_monan)
@app.route('/api_get_data/buaan',methods=['GET'])
def api_get_buaan():
	return jsonify(data_buaan)