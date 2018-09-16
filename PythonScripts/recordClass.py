# class containing data structure
import re
import json
from dateutil.parser import parse
import users
import moonphase

monthDict = {}
monthDict['jan'] = "Jan"
monthDict['fev'] = "Feb"
monthDict['mar'] = "Mar"
monthDict['abr'] = "Apr"
monthDict['mai'] = "May"
monthDict['jun'] = "Jun"
monthDict['jul'] = "Jul"
monthDict['ago'] = "Aug"
monthDict['set'] = "Sep"
monthDict['out'] = "Oct"
monthDict['nov'] = "Nov"
monthDict['z'] = "Dec" # regex removes de 


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

        # short or long (0, 1)
        self.type = 0

    def getNewUserID(self):
        uuid = self.fileDict['sightings'][0]['seen_by']
        # for each user, check for uuid 
        for phoneID, user in users.phoneList.items() :
            if uuid in user.uuids :
                return user.generatedID
        
        raise ValueError("UUID not linked to any user account") 

    def setVars(self):
        self.uuid = self.getNewUserID()
        # change from list to single str/int if needed.        
        self.species = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['2'])
        self.year = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['3'])
        # change year to correct format
        self.formatYear()
        self.month = validateAnswerLength(self.fileDict['sightings'][0]['answers'][0]['4'])
        # change date to correct format (without time)
        self.dateRange = []
        self.formatDateRange(self.fileDict['sightings'][0]['answers'][0]['5'])       
        self.moonState = self.findMoonState()


    def findMoonState(self):
        moonSelect = []
        for date in self.dateRange :
            dateStr = date.split("/")
            moonSelect.append(moonphase.phase(int(dateStr[2]), int(dateStr[1]), int(dateStr[0])))

        return moonSelect

    def formatSub(self):
        de = re.compile('(de)')
        temp = de.sub('', self.submission)
        temp = temp.split(' ')
        reg = re.compile('[a-z]+')
        final = ""
        for temps in temp:
            if (reg.match(temps)):
                try :
                    final += monthDict[temps]
                    final += " "
                except :
                    print ("Unknown date!!")
            else :
                final += temps
                final += " "
                
        self.submission = str(parse(final, dayfirst=True))

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
        self.formatSub()
        
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
        self.formatSub()
        
