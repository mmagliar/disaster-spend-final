import json
from flask import (
    Flask,
    render_template,
    jsonify)

from flask_sqlalchemy import SQLAlchemy

# Start a database
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///resources/data/disaster.sqlite"

db = SQLAlchemy(app)


# Create our database model
class Disaster(db.Model):
    __tablename__ = 'us_data'

    RecordID = db.Column(db.Integer, primary_key=True)
    disasterNumber = db.Column(db.String)
    disasterType = db.Column(db.String)
    title = db.Column(db.String)
    incidentType = db.Column(db.String)
    damageCategory = db.Column(db.String)
    state = db.Column(db.String)
    stateCode = db.Column(db.String)
    county = db.Column(db.String)
    fyDeclared = db.Column(db.Integer)
    monthDeclared = db.Column(db.Integer)
    Sum_projectAmount = db.Column(db.Integer)
    Sum_federalShareObligated= db.Column(db.Integer)
    Sum_totalObligated = db.Column(db.Integer)

    def __repr__(self):
        return '<Disaster %r>' % (self.name)


# Create database tables
@app.before_first_request
def setup():
    # Recreate database each time for demo
    # db.drop_all()
    db.create_all()


# Define routes
@app.route("/")
def federal():
    return render_template("federal.html")

@app.route("/state")
def state():
    return render_template("state.html")

@app.route("/table")
def table():
    return render_template("table.html")

# These routes are called to run queries for our page data
@app.route('/agCount')
def agCount():
    aggCount = db.session.query(Disaster.fyDeclared, 
               db.func.count(Disaster.Sum_totalObligated), 
               db.func.sum(Disaster.Sum_totalObligated)).group_by(Disaster.fyDeclared).all()   
    return jsonify(aggCount)

@app.route('/incidentList')
def incList():
    incidentData = db.session.query(
        Disaster.incidentType,
        db.func.count(Disaster.Sum_totalObligated),
        db.func.sum(Disaster.Sum_totalObligated)
    ).group_by(Disaster.incidentType).all()

    return jsonify(incidentData)

@app.route('/countryData')
def countryData():
    countryData = db.session.query(
        Disaster.state,
        db.func.count(Disaster.Sum_totalObligated),
        db.func.sum(Disaster.Sum_totalObligated)
    ).group_by(Disaster.state).all()

    return jsonify(countryData)

@app.route('/stateCounty/<stateName>')
def stateData(stateName):
    countyGroupedData = db.session.query(
        Disaster.county,
        db.func.count(Disaster.Sum_totalObligated),
        db.func.sum(Disaster.Sum_totalObligated),
        (db.func.sum(Disaster.Sum_totalObligated) / db.func.count(Disaster.Sum_totalObligated))
    ).group_by(Disaster.county).filter(Disaster.state == stateName).all()

    return jsonify(countyGroupedData)

@app.route('/stateIncident/<stateName>')
def incidentData(stateName):
    incidentGroupedData = db.session.query(
        Disaster.incidentType,
        db.func.count(Disaster.Sum_totalObligated),
        db.func.sum(Disaster.Sum_totalObligated)
    ).group_by(Disaster.incidentType).filter(Disaster.state == stateName).all()

    return jsonify(incidentGroupedData)

@app.route('/damTotscount')
def damagecount():
    damcount = db.session.query(Disaster.damageCategory,
        db.func.count(Disaster.Sum_totalObligated)
    ).group_by(Disaster.damageCategory).all()
    return jsonify(damcount)

@app.route('/damTotsAmount')
def damageamount():
    damamount = db.session.query(Disaster.damageCategory,
        db.func.sum(Disaster.Sum_totalObligated)
    ).group_by(Disaster.damageCategory).all()
    return jsonify(damamount)


if __name__ == '__main__':
    app.run(debug=True, port=8000)