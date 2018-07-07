# class containing data structure
import re
import json

def validateAnswerLength(answer):
    if len(answer) == 1 :
        #print ("only 1 answer")
        # parse if needed
        try :
            return int(answer[0])
        except:
            return answer[0] 
    else :
        #print ("multiple answers")
        return answer
        

class Record(object):   
    
    def __init__(self, file):
        # store filepath
        self.fileName = file
        
        # open file and store string
        with open(file, "r") as handle:
            self.fileDict = json.loads(handle.read())

        # set variables that are consistent in both modes
        self.setVars()
        
        self.phoneid = ''
        self.moonState = ''

        # short or long (0, 1)
        self.type = 0


    def setVars(self):
        self.uuid = self.fileDict['sightings'][0]['seen_by']
        # change from list to single str/int if needed.        
        self.species = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['2'])
        self.year = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['3'])
        # change year to correct format
        self.formatYear()
        self.month = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['4'])
        # change date to correct format (without time)
        self.dateRange = []
        self.formatDateRange(self.fileDict['sightings'][0]['answers'][0]['5'])       


    def formatYear(self):
        # change 0/1/2 into real year
        tempYear = 2016
        self.year = tempYear + self.year    

    def formatDateRange(self, dateRange):
        # remove time from date ans
        for day in dateRange:
            splitStr = day.split()
            self.dateRange.append(splitStr[0])
        
    def getFile(self):
        return self.fileDict

    def __str__(self):
        return "I am crab data"


class Short(Record):
    def __init__(self, file):
        Record.__init__(self, file)
        self.setSpecVars()
        
    def setSpecVars(self):
        # q6 observed state
        self.state = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['6'])
        # q7 observed county
        self.county = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['7'])
        # q8 job
        self.job = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['8'])
        # q9 submission
        self.submission = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['9'])

    def __str__(self):
        return "I am SHORT"
        

class Long(Record):

    def __init__(self, file):
        Record.__init__(self, file)
        self.setSpecVars()

    def formatPDate(self):
        try :
            splitString = self.fileDict['sightings'][0]['answers'][0]['6'][0].split()
            return splitString[0]
        except :
            return ""

    def setSpecVars(self): 
        # overwrite long type
        self.type = 1
        # q6 most prominent date
        self.prominent = self.formatPDate()
        # q7 another seen in last 2 weeks - Y/N/IDK - Yes leads to (Lower, Similar, Higher, Idk)
        self.another = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['7'])
        # q8 what time of day - Day, Night, Both, Idk
        self.timeofday = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['8'])
        # Females Berried - Y/N/IDK
        self.berried = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['9'])
        # Habitat - Multiple choice (Mangrove, Hinterland/SaltFlat, Beach, MudFlat, Other)
        self.habitat = re.findall('\w+', self.fileDict['sightings'][0]['answers'][0]['10'][0])
        # State
        self.state = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['11'])
        # County
        self.county = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['12'])
        # Local Name for spot (text entry or IDK)
        self.localName = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['13'])
        # Protected Area - Y/N/IDK (if yes, list or type field)
        self.protectedArea = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['14'])
        # Let us know what you do
        self.job = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['15'])
        # Additional field of text
        self.additionalObs = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['16'])
        # Submission
        self.submission = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['17'])


        
