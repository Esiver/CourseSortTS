// ---- Helpers
// utility
function randomIntFromInterval(min:number, max:number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
};
function getRandomTimeslot(timeslotArray:Timeslot[]){
    let timeslot:Timeslot = timeslotArray[Math.floor(Math.random()*timeslotArray.length)];
    
    return timeslot;
}
function checkMatchingTimeslotValues(array1:Timeslot[], array2:Timeslot[]){
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
          if (array1[i].startHour >= array2[j].startHour && array1[i].endHour <= array2[i].endHour) {
            return true; // match found
          }
        }
      }
      return false; // no match found
}

function hasMatchingCompetenceValues(competenceArray1:Competence[], competenceArray2:Competence[]){
  // Check if arr2 contains the same values as arr1
  const isEqual = competenceArray1.every(val1 => competenceArray2.some(val2 => JSON.stringify(val1) === JSON.stringify(val2)));
  // Log a message if arr2 doesn't contain the same values as arr1
  if (!isEqual) {
    console.log("arr2 does not contain the same values as arr1");
    return false
  }
  else {
    return true
  }
}

// function getTimeAvailable(timeslotArray:Timeslot[]){
//     let timeslot:Timeslot = timeslotArray;

//     return timeslot;
// }

// ----- interfaces

interface Competence {
    label: string
};

interface Timeslot {
    startHour : number,
    endHour : number,
    course?: Course,
    teacher? : Teacher
};

interface TeacherCourseFit {
    teacher: Teacher,
    course: Course,
    fit: number
}


// --------- Classes
class Course {
    id:string;
    name: string;
    competenceArray: Competence[];
    timeSlotArray : Timeslot[];
    location : number;
    competentTeachers: Teacher[] = [];
    nearbyTeachers : Teacher[] = [];
    timeAvailableTeachers : Teacher[] = [];
    appointedTeacherArray:Teacher[] = [];
    requiredTeacherCount:number;

    constructor(id:string, name:string, competenceArray:Competence[], timeslotArray:Timeslot[], location: number, requiredTeacherCount:number){
        this.id = id;
        this.name = name;
        this.competenceArray = this.setCompetence(competenceArray);
        this.timeSlotArray = timeslotArray;
        this.location = location;
        this.requiredTeacherCount = requiredTeacherCount;

        this.competentTeachers = this.competentTeachers;
        this.nearbyTeachers = this.nearbyTeachers;
        this.timeAvailableTeachers = this.timeAvailableTeachers

        this.appointedTeacherArray = this.appointedTeacherArray;
    };

    setCompetence(competenceArray:Competence[]){
        let copyArray = [...competenceArray];
        let length = randomIntFromInterval(1,competenceArray.length);
        let setRandomCompetenceArray:Competence[] = [];//[{label: "Math"}, {label: "Prince-2"}];//Array<Competence>;
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random()*copyArray.length);
            setRandomCompetenceArray.push(copyArray[randomIndex]);
            copyArray.splice(randomIndex,1);
        }
        return setRandomCompetenceArray
    }
};


class Teacher {
    id:string;
    name: string;
    competenceArray: Competence[];
    // availableTimeStart : number;
    // availableTimeEnd : number;
    timeSlotArray : Timeslot[];

    location : number;
    appointedCourse : Course[] = [];

    constructor(id:string, name:string, competenceArray:Competence[], timeslotArray:Timeslot[], location: number){
        this.name = name;
        this.competenceArray = this.setCompetence(competenceArray);
        // this.availableTimeStart = availableTimeStart;
        // this.availableTimeEnd = availableTimeEnd;
        this.timeSlotArray = timeslotArray;
        this.location = location;
        this.appointedCourse = this.appointedCourse
    }

    setCompetence(competenceArray:Competence[]){
        let copyArray = [...competenceArray];
        let length = randomIntFromInterval(1,competenceArray.length);
        let setRandomCompetenceArray:Competence[] = [];//[{label: "Math"}, {label: "Prince-2"}];//Array<Competence>;
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random()*copyArray.length);
            setRandomCompetenceArray.push(copyArray[randomIndex]);
            copyArray.splice(randomIndex,1);
        }
        return setRandomCompetenceArray
    }
}


// ------ Functions

// generating
function generateTeacherArray(amount:number, competenceArray:Competence[], timeslotArray:Timeslot[]){
    let teacherArray:Teacher[] = [];

    for (let i = 0; i < amount; i++) {
        let instanceTimeslotArray:Timeslot[] = []
        let timeslot:Timeslot = getRandomTimeslot(timeslotArray);
        instanceTimeslotArray.push(timeslot);

        let location2d = Math.random() * 1000;
        let newTeacher:Teacher = new Teacher(`tID-${i}`,`teacher-name-${i}`, competenceArray, instanceTimeslotArray, location2d);

        teacherArray.push(newTeacher);
    }
    return teacherArray;
}

function generateCourseArray(amount:number, competenceArray:Competence[], timeslotArray:Timeslot[]){
    let courseArray:Course[] = [];

    for (let i = 0; i < amount; i++) {
        let instanceTimeslotArray:Timeslot[] = []
        let timeslot:Timeslot = getRandomTimeslot(timeslotArray);
        instanceTimeslotArray.push(timeslot)

        let location2d = Math.random() * 1000;
        let courseRequiredTeacherCount:number = randomIntFromInterval(1,2);

        let newCourse:Course = new Course(`cID-${i}`,`course-name-${i}`, competenceArray, instanceTimeslotArray, location2d, courseRequiredTeacherCount);
        courseArray.push(newCourse);
    }
    return courseArray;
}


//sorting
function getQualifiedTeachers(course:Course, teacherArray:Teacher[]){
    let qualifiedTeachersArray:Teacher[] = [];
    let requiredCompetenceArray:Competence[] = course.competenceArray;
    
    teacherArray.forEach(teacher => {
        // For each teacher, we check if they're qualigfied
        if (requiredCompetenceArray.every((obj:Competence, index:number) => obj?.label == teacher.competenceArray[index]?.label)){
            qualifiedTeachersArray.push(teacher);
        } else {
            // console.log("teacher", teacher, "did not has to required competences");
        }
        
    });

    return qualifiedTeachersArray;
}

function getTimeAvailableTeachers(course:Course, teacherArr:Teacher[]){
    let timeAvailableTeachersArray:Teacher[] = [];
    let courseTimeAvailableArray:Timeslot[] = course.timeSlotArray;
    
    teacherArr.forEach(teacher => {
        let teacherTimeAvailableArray:Timeslot[] = teacher.timeSlotArray;
        if(checkMatchingTimeslotValues(courseTimeAvailableArray, teacherTimeAvailableArray)){
            timeAvailableTeachersArray.push(teacher);
        }
    })

    return timeAvailableTeachersArray
}

function getNearbyTeachers(course:Course, teacherArray:Teacher[], distThreshold =1):Teacher[]{
    let nearbyTeachersArray:Teacher[] = [];

    teacherArray.forEach(teacher=> {
        let absoluteDist = getTeacherCourseDistance(teacher, course);
        let isNearby = absoluteDist < distThreshold ? true : false;
        if (isNearby){
            nearbyTeachersArray.push(teacher);
        }
    })

    return nearbyTeachersArray;
}
function checkPotentialCourses(courseArray:Course[], teacherArray:Teacher[]){
    //checks if competent teachers, timeavailable teachers, as well as nearby teachers.
    let potentialCourseArray:Course[] = [...courseArray]; // all courses
    potentialCourseArray.forEach(course => {
        course.competentTeachers = getQualifiedTeachers(course, teacherArray);
        course.timeAvailableTeachers = getTimeAvailableTeachers(course, teacherArray);
        course.nearbyTeachers = getNearbyTeachers(course, teacherArray);
    });
    return potentialCourseArray;
};

function checkNoMatchCourses(courseArray:Course[]):Course[]{
    let noMatchCourseArray:Course[] = [];
    courseArray.forEach(course => {
        if(course.competenceArray.length == 0 || course.nearbyTeachers.length == 0 || course.timeAvailableTeachers.length == 0){
           noMatchCourseArray.push(course);
        }
    });
    return noMatchCourseArray;
}

function getTeacherCourseDistance(teacher:Teacher, course:Course):number {
    let distance = Math.abs( teacher.location - course.location);
    return distance
}
function getTeacherCourseDistanceFit(teacher:Teacher, course:Course):number {
    let fitScore = getTeacherCourseDistance(teacher, course);
    return fitScore;
}
function getTeacherCourseCompetenceFit(teacher:Teacher, course:Course):number{
    let fitScore:number;

    if(!hasMatchingCompetenceValues(teacher.competenceArray, course.competenceArray)) {
        fitScore = 0;
    } else {
        fitScore = 1
    }

    return fitScore;
}
function getTeacherCourseTimeFit (teacher:Teacher, course:Course):number {
    let fitScore:number = 0;

    return fitScore;
}

function getTeacherCourseFit(teacher:Teacher, course:Course):TeacherCourseFit {
    // more competentTeachers => less operations in here...
    let fitScore:number = 0;
    let distanceFitScore:number = 0;
    let TimeFitScore:number = 0;
    let competenceFitScore:number = 0;

    distanceFitScore = getTeacherCourseDistanceFit(teacher, course);
    TimeFitScore = getTeacherCourseTimeFit(teacher, course);
    competenceFitScore = getTeacherCourseCompetenceFit(teacher,course);

    fitScore = (distanceFitScore + TimeFitScore) * competenceFitScore;
    
    let teacherCoursefit:TeacherCourseFit = {
        teacher: teacher,
        course: course,
        fit: fitScore
    };
    return teacherCoursefit;
}

function getTeacherCourseFitArray(courseArray: Course[], teacherArray:Teacher[], timeslotArray:Timeslot[]):TeacherCourseFit[] {
    // returns a arrya of teacherCourseFits, rated with a numerical score. 
    // use this array of fits to assign teachers to courses? 

    let teacherCourseFitArray:TeacherCourseFit[] = [];

    timeslotArray.forEach(timeslot => {
        courseArray.forEach(course => {
            teacherArray.forEach(teacher => {
                let teacherCourseFit:TeacherCourseFit = getTeacherCourseFit(teacher, course)
                if(teacherCourseFit.fit > 0){
                    teacherCourseFitArray.push(teacherCourseFit);
                };
            })
        });
    });
    
    return teacherCourseFitArray;
}

function sortCourseArrayTeachersTime(courseArray:Course[]):Course[]{
    let sortedCourseArray:Course[] = [];
    courseArray.forEach(course=> {
        if(course.competentTeachers.length > 0){
            let coursePotentialTeachersWithinTime:Teacher[] = [];
            course.competentTeachers.forEach(teacher=> {
                if (checkMatchingTimeslotValues(course.timeSlotArray, teacher.timeSlotArray)){
                    coursePotentialTeachersWithinTime.push(teacher);
                }
            })
            course.competentTeachers = coursePotentialTeachersWithinTime;
            sortedCourseArray.push(course)
        }
    })
    return sortedCourseArray;
}
function sortCourseArrayTeachersDistance(courseArray:Course[]):Course[]{
    let sortedCourseArray:Course[] = [...courseArray];
    sortedCourseArray.forEach(course=>{
        course.competentTeachers.sort(({location:a}, {location:b}) => a - b);
    });
    
    return sortedCourseArray;
}
function assignCourseArrayTeachers(courseArray:Course[]):Course[] {
    let assignedCourseArray:Course[] = [...courseArray]; // actually should be called "toBeAssignedCourseArray", hehe
    
    assignedCourseArray.forEach(course=> {
        

        //*
        course.competentTeachers.forEach(competentTeacher => { // we try and match each potential teacher with the course
            let teacherToAppoint:Teacher = competentTeacher//course.competentTeachers[attemptIndex];
            let letMatch:boolean = false;

            if(typeof teacherToAppoint != 'undefined' && teacherToAppoint){
               // Check if teachers timeslot for the course is free?
                if(course.appointedTeacherArray.length < course.requiredTeacherCount){
                    
                    teacherToAppoint.timeSlotArray.forEach(teacherTimeslot => {
                        // we try to assign each timeslot if possible
                        // but each timeslot can only be assigned to one course!
                        if (!teacherTimeslot.course){
                            // we check if the timeslot matches with one of the course's timeslot
                            course.timeSlotArray.forEach(courseTimeslot => {
                                if(teacherTimeslot.startHour == courseTimeslot.startHour && teacherTimeslot.endHour == courseTimeslot.endHour){
                                    // now we can appoint the course to the teacher's timeslot
                                    teacherTimeslot.course = course;
                                    console.log("push?")
                                    letMatch = true;

                                }
                            })
                        }
                    })
    
                    // then we push all 
                    teacherToAppoint.timeSlotArray.forEach(teacherTimeslot => {
                        if (teacherTimeslot.course){
                            if (teacherTimeslot.course == course && letMatch){
                                console.log("push !!")

                                teacherToAppoint.appointedCourse.push(course);
                                course.appointedTeacherArray.push(teacherToAppoint);
                            }
                        }
                    })
                    
                }
                console.log("...",course.name, " - ", competentTeacher.name, course, competentTeacher)

            }
        })

        
        

        //*


        if(typeof course.appointedTeacherArray == 'undefined' || course.appointedTeacherArray.length == 0){
            let attempts = 2;
            for (let attemptIndex = 0; attemptIndex < attempts; attemptIndex++) {
             //*

          //*      
            }

            // teacherToAppoint.appointedCourse = course;
            
            // appoint a teacher to the course!
        }
    })

    return assignedCourseArray;
}

// ---- begin / setup
let competenceArray:Competence[] = [{label: "Math"}, {label: "Prince-2"}, {label: "Queen-1"}];
let timeslotArray:Timeslot[] = [{startHour: 0830, endHour: 1000}, {startHour: 1030, endHour: 1200}, {startHour: 1300, endHour: 1430}, {startHour:1500, endHour: 1600}, {startHour:2000, endHour: 2100}] // fix hours do date...
let teacherCourseFitMatrix;
let teacherArray:Teacher[] = generateTeacherArray(10, competenceArray, timeslotArray);
let courseArray:Course[]= generateCourseArray(20, competenceArray, timeslotArray);

// 1) For each course, create a list of all available teachers who meet the qualifications for that course.
let potentialCourseArray:Course[] = checkPotentialCourses(courseArray, teacherArray);

// 2) Sort the list of teachers for each course based on their availability during the course schedule.
// altså hvis the givne kursus' potentielle underviseres tidsplan kan passe ind i kursets tidsplan.
// // 2.5) sort according to distance
// let sortedTeacherDistancePotentialCourseArray:Course[] = sortCourseArrayTeachersDistance(sortedTeacherTimeAvailabilityPotentialCourseArray);
let sortedTeacherCourseArray:Course[] = sortCourseArrayTeachersDistance(sortCourseArrayTeachersTime(potentialCourseArray))
// 3) If multiple teachers are equally available, choose the teacher who lives closest to the course location.
let assignedCourseArray:Course[] = assignCourseArrayTeachers(sortedTeacherCourseArray);







// _____________________ HTML __________________________

function courseArrayRenderHtml(courseArray:Course[], containerSelector:string="#course-list"){
    let target = containerSelector;
    
    const courseArrayDom: HTMLElement = document.querySelector(target)!;
    courseArray.forEach(course=>{
        let courseDom:HTMLElement = document.createElement('li');
        courseDom.classList.add('course__item')
        courseDom.appendChild(courseRenderHtml(course));
        courseArrayDom.appendChild(courseDom)
    })
    
    
}

function courseRenderHtml(course:Course):HTMLElement{
    let wrapperDom:HTMLElement = document.createElement('div');
    let courseNameDOM:HTMLElement = document.createElement('label');
    let courseAppointedTeacherList:HTMLElement = document.createElement('ul');
    let courseCompetenceListDOM:HTMLElement = document.createElement('ul');
    let courseTimeSlotString:string = " ";
    let courseRequiredTeacherCountDOM = document.createElement('p');

    wrapperDom.classList.add('course__wrapper');
    courseNameDOM.classList.add('course__name');
    courseAppointedTeacherList.classList.add('course__teachers');


    course.timeSlotArray.forEach(timeslot => {
        courseTimeSlotString = courseTimeSlotString + `(${timeslot.startHour} - ${timeslot.endHour})`;
    });
    
    courseNameDOM.innerText = course.name + courseTimeSlotString;
    courseRequiredTeacherCountDOM.innerText = `req. teachers: ${course.requiredTeacherCount}`;

    course.appointedTeacherArray.forEach(teacher=>{
        let teacherDom:HTMLElement = teacherRenderHtml(teacher)
        courseAppointedTeacherList.appendChild(teacherDom)
    });
    course.competenceArray.forEach(comptence => {
        let competenceDOM:HTMLElement = document.createElement('div');
        competenceDOM.innerText = comptence.label;
        courseCompetenceListDOM.appendChild(competenceDOM);
    });

    wrapperDom.appendChild(courseNameDOM);
    wrapperDom.appendChild(courseRequiredTeacherCountDOM);
    wrapperDom.appendChild(courseCompetenceListDOM);
    if(course.appointedTeacherArray.length > 0){
        wrapperDom.appendChild(courseAppointedTeacherList);
    }

    return wrapperDom
}

function teacherRenderHtml(teacher:Teacher):HTMLElement{
    let teacherItemDOM:HTMLElement = document.createElement('li')
    let teacherAppointedCourseListDOM:HTMLElement = document.createElement('ul');
    let teacherNameDOM:HTMLElement = document.createElement('div');
    let teacherCompetenceListDOM:HTMLElement = document.createElement('ul');
    let teacherTimeAvailableListDom:HTMLElement = document.createElement('ul');

    teacherItemDOM.classList.add('teacher__container');
    teacherNameDOM.classList.add('teacher__name');
    teacherAppointedCourseListDOM.classList.add('teacher__list')
    teacherCompetenceListDOM.classList.add('teacher__list')
    teacherTimeAvailableListDom.classList.add('teacher__list');

    teacherNameDOM.innerText = teacher.name;
    teacher.appointedCourse.forEach(course => {
        let appCourseDOM = document.createElement('li');
        appCourseDOM.classList.add('teacher__appointed-course')
        appCourseDOM.innerText = `appointed '${course.name}'`
        teacherAppointedCourseListDOM.appendChild(appCourseDOM);
    })
    teacher.competenceArray.forEach(competence => {
        let teacherCompetenceDom:HTMLElement = document.createElement('li');
        teacherCompetenceDom.innerText = competence.label;
        teacherCompetenceListDOM.appendChild(teacherCompetenceDom);
    })
    teacher.timeSlotArray.forEach(timeslot =>{
        let timeslotDOM:HTMLElement = document.createElement('li');
        let timeslotString:string = `(${timeslot.startHour})-(${timeslot.endHour})`;
        timeslotDOM.innerText = timeslotString;
        teacherTimeAvailableListDom.appendChild(timeslotDOM);
    })

    teacherItemDOM.appendChild(teacherNameDOM)
    teacherItemDOM.appendChild(teacherAppointedCourseListDOM)
    teacherItemDOM.appendChild(teacherCompetenceListDOM)
    teacherItemDOM.appendChild(teacherTimeAvailableListDom);

    return teacherItemDOM;
}

function listTeacherArrayHtml(teacherArray:Teacher[], containerSelector:string="#teacher-list"){
    let target = containerSelector;
    
    const teacherArrayDom:HTMLElement = document.querySelector(target)!;
    teacherArray.forEach(teacher=>{
        let teacherDom:HTMLElement = document.createElement('li');
        teacherDom.classList.add('teacher__item')
        teacherDom.appendChild(teacherRenderHtml(teacher));
        teacherArrayDom.appendChild(teacherDom)
    })
    
}

listTeacherArrayHtml(teacherArray);
courseArrayRenderHtml(courseArray);







// let noMatchCourses:Course[] = checkNoMatchCourses(courseArray); // præ-sorteret for ingen match. Håndtér senere.

// let courseTeacherFitArray:TeacherCourseFit[] = getTeacherCourseFitArray(courseArray, teacherArray, timeslotArray);  // how each timeslot for each course fits with each teacher! (POTENTIALLY HEAVY LOOP x^n3 ?...)
// let assignedCourses:Course[] = assignTeachersToCourses(courseTeacherFitArray);
// let assignTeacherCourse(courseArray, teacherArray);


