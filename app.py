import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template

engine = create_engine("sqlite:///belly_button_biodiversity.sqlite")

Base = automap_base()

Base.prepare(engine, reflect=True)

session = Session(engine)

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def welcome():
	return render_template("index.html")
@app.route('/names')
#List of sample names.
def names():
	result = engine.execute("SELECT SAMPLEID FROM samples_metadata;")
	names_list = ["BB_" + str(r.SAMPLEID) for r in result ]
	names_dict = {"sample names": names_list}
	return jsonify([names_dict])

@app.route('/otu')
def descriptions():
	result = engine.execute("SELECT lowest_taxonomic_unit_found FROM otu;")
	otu_desc_list = [str(r.lowest_taxonomic_unit_found) for r in result ]
	otu_desc_dict = {"OTU descriptions": otu_desc_list}
	return jsonify([otu_desc_dict])

@app.route('/metadata/<sample>')
def sample(sample):
	s = sample[3:]
	query = "SELECT AGE, BBTYPE, ETHNICITY, GENDER, LOCATION, SAMPLEID FROM samples_metadata WHERE SAMPLEID = '%s' ;"%(s)
	#Calling result multiple times is awkward but necessary; what would be a better way?
	result = engine.execute(query)
	age = [r.AGE for r in result][0]
	result = engine.execute(query)
	bbtype = [r.BBTYPE for r in result][0]
	result = engine.execute(query)
	ethnicity = [r.ETHNICITY for r in result][0]
	result = engine.execute(query)
	gender = [r.GENDER for r in result][0]
	result = engine.execute(query)
	location = [r.LOCATION for r in result][0]
	result = engine.execute(query)
	sampleid = [r.SAMPLEID for r in result][0]
	sample_dict = {"Age": age, "bbtype": bbtype, "Ethnicity": ethnicity, "Gender": gender, "Location": location, "Sample ID": sampleid}
	return jsonify([sample_dict])

@app.route('/wfreq/<sample>')
def washfreq(sample):
	s = sample[3:]
	query = "SELECT WFREQ, SAMPLEID FROM samples_metadata WHERE SAMPLEID = '%s' ;"%(s)
	result = engine.execute(query)
	wash_freq = [r.WFREQ for r in result][0]
	wash_dict = {"Wash Frequency": wash_freq}
	return jsonify([wash_dict])

@app.route('/samples/<sample>')
def sample_name(sample):
	s= sample
	query = "SELECT %s AS value , otu_id FROM samples ORDER BY %s DESC ;"%(s,s)
	result = engine.execute(query)
	sample_value_list = [r.value for r in result]
	result = engine.execute(query)
	sample_otu_list = [r.otu_id for r in result]
	sample_dict = {"otu_ids": sample_otu_list, "sample_values":sample_value_list}
	return jsonify([sample_dict])

if __name__ == "__main__":
    app.run(debug=True)












