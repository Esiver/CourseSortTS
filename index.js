var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
;
function getRandomTimeslot(timeslotArray) {
    var timeslot = timeslotArray[Math.floor(Math.random() * timeslotArray.length)];
    return timeslot;
}
function checkMatchingTimeslotValues(array1, array2) {
    for (var i = 0; i < array1.length; i++) {
        for (var j = 0; j < array2.length; j++) {
            if (array1[i].startHour >= array2[j].startHour && array1[i].endHour <= array2[i].endHour) {
                return true;
            }
        }
    }
    return false;
}
function hasMatchingCompetenceValues(competenceArray1, competenceArray2) {
    var isEqual = competenceArray1.every(function (val1) { return competenceArray2.some(function (val2) { return JSON.stringify(val1) === JSON.stringify(val2); }); });
    if (!isEqual) {
        console.log("arr2 does not contain the same values as arr1");
        return false;
    }
    else {
        return true;
    }
}
;
;
var Course = (function () {
    function Course(id, name, competenceArray, timeslotArray, location, requiredTeacherCount) {
        this.competentTeachers = [];
        this.nearbyTeachers = [];
        this.timeAvailableTeachers = [];
        this.appointedTeacherArray = [];
        this.id = id;
        this.name = name;
        this.competenceArray = this.setCompetence(competenceArray);
        this.timeSlotArray = timeslotArray;
        this.location = location;
        this.requiredTeacherCount = requiredTeacherCount;
        this.competentTeachers = this.competentTeachers;
        this.nearbyTeachers = this.nearbyTeachers;
        this.timeAvailableTeachers = this.timeAvailableTeachers;
        this.appointedTeacherArray = this.appointedTeacherArray;
    }
    ;
    Course.prototype.setCompetence = function (competenceArray) {
        var copyArray = __spreadArray([], competenceArray, true);
        var length = randomIntFromInterval(1, competenceArray.length);
        var setRandomCompetenceArray = [];
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * copyArray.length);
            setRandomCompetenceArray.push(copyArray[randomIndex]);
            copyArray.splice(randomIndex, 1);
        }
        return setRandomCompetenceArray;
    };
    return Course;
}());
;
var Teacher = (function () {
    function Teacher(id, name, competenceArray, timeslotArray, location) {
        this.appointedCourse = [];
        this.name = name;
        this.competenceArray = this.setCompetence(competenceArray);
        this.timeSlotArray = timeslotArray;
        this.location = location;
        this.appointedCourse = this.appointedCourse;
    }
    Teacher.prototype.setCompetence = function (competenceArray) {
        var copyArray = __spreadArray([], competenceArray, true);
        var length = randomIntFromInterval(1, competenceArray.length);
        var setRandomCompetenceArray = [];
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * copyArray.length);
            setRandomCompetenceArray.push(copyArray[randomIndex]);
            copyArray.splice(randomIndex, 1);
        }
        return setRandomCompetenceArray;
    };
    return Teacher;
}());
function generateTeacherArray(amount, competenceArray, timeslotArray) {
    var teacherArray = [];
    for (var i = 0; i < amount; i++) {
        var instanceTimeslotArray = [];
        var timeslot = getRandomTimeslot(timeslotArray);
        instanceTimeslotArray.push(timeslot);
        var location2d = Math.random() * 1000;
        var newTeacher = new Teacher("tID-".concat(i), "teacher-name-".concat(i), competenceArray, instanceTimeslotArray, location2d);
        teacherArray.push(newTeacher);
    }
    return teacherArray;
}
function generateCourseArray(amount, competenceArray, timeslotArray) {
    var courseArray = [];
    for (var i = 0; i < amount; i++) {
        var instanceTimeslotArray = [];
        var timeslot = getRandomTimeslot(timeslotArray);
        instanceTimeslotArray.push(timeslot);
        var location2d = Math.random() * 1000;
        var courseRequiredTeacherCount = randomIntFromInterval(1, 2);
        var newCourse = new Course("cID-".concat(i), "course-name-".concat(i), competenceArray, instanceTimeslotArray, location2d, courseRequiredTeacherCount);
        courseArray.push(newCourse);
    }
    return courseArray;
}
function getQualifiedTeachers(course, teacherArray) {
    var qualifiedTeachersArray = [];
    var requiredCompetenceArray = course.competenceArray;
    teacherArray.forEach(function (teacher) {
        if (requiredCompetenceArray.every(function (obj, index) { var _a; return (obj === null || obj === void 0 ? void 0 : obj.label) == ((_a = teacher.competenceArray[index]) === null || _a === void 0 ? void 0 : _a.label); })) {
            qualifiedTeachersArray.push(teacher);
        }
        else {
        }
    });
    return qualifiedTeachersArray;
}
function getTimeAvailableTeachers(course, teacherArr) {
    var timeAvailableTeachersArray = [];
    var courseTimeAvailableArray = course.timeSlotArray;
    teacherArr.forEach(function (teacher) {
        var teacherTimeAvailableArray = teacher.timeSlotArray;
        if (checkMatchingTimeslotValues(courseTimeAvailableArray, teacherTimeAvailableArray)) {
            timeAvailableTeachersArray.push(teacher);
        }
    });
    return timeAvailableTeachersArray;
}
function getNearbyTeachers(course, teacherArray, distThreshold) {
    if (distThreshold === void 0) { distThreshold = 1; }
    var nearbyTeachersArray = [];
    teacherArray.forEach(function (teacher) {
        var absoluteDist = getTeacherCourseDistance(teacher, course);
        var isNearby = absoluteDist < distThreshold ? true : false;
        if (isNearby) {
            nearbyTeachersArray.push(teacher);
        }
    });
    return nearbyTeachersArray;
}
function checkPotentialCourses(courseArray, teacherArray) {
    var potentialCourseArray = __spreadArray([], courseArray, true);
    potentialCourseArray.forEach(function (course) {
        course.competentTeachers = getQualifiedTeachers(course, teacherArray);
        course.timeAvailableTeachers = getTimeAvailableTeachers(course, teacherArray);
        course.nearbyTeachers = getNearbyTeachers(course, teacherArray);
    });
    return potentialCourseArray;
}
;
function checkNoMatchCourses(courseArray) {
    var noMatchCourseArray = [];
    courseArray.forEach(function (course) {
        if (course.competenceArray.length == 0 || course.nearbyTeachers.length == 0 || course.timeAvailableTeachers.length == 0) {
            noMatchCourseArray.push(course);
        }
    });
    return noMatchCourseArray;
}
function getTeacherCourseDistance(teacher, course) {
    var distance = Math.abs(teacher.location - course.location);
    return distance;
}
function getTeacherCourseDistanceFit(teacher, course) {
    var fitScore = getTeacherCourseDistance(teacher, course);
    return fitScore;
}
function getTeacherCourseCompetenceFit(teacher, course) {
    var fitScore;
    if (!hasMatchingCompetenceValues(teacher.competenceArray, course.competenceArray)) {
        fitScore = 0;
    }
    else {
        fitScore = 1;
    }
    return fitScore;
}
function getTeacherCourseTimeFit(teacher, course) {
    var fitScore = 0;
    return fitScore;
}
function getTeacherCourseFit(teacher, course) {
    var fitScore = 0;
    var distanceFitScore = 0;
    var TimeFitScore = 0;
    var competenceFitScore = 0;
    distanceFitScore = getTeacherCourseDistanceFit(teacher, course);
    TimeFitScore = getTeacherCourseTimeFit(teacher, course);
    competenceFitScore = getTeacherCourseCompetenceFit(teacher, course);
    fitScore = (distanceFitScore + TimeFitScore) * competenceFitScore;
    var teacherCoursefit = {
        teacher: teacher,
        course: course,
        fit: fitScore
    };
    return teacherCoursefit;
}
function getTeacherCourseFitArray(courseArray, teacherArray, timeslotArray) {
    var teacherCourseFitArray = [];
    timeslotArray.forEach(function (timeslot) {
        courseArray.forEach(function (course) {
            teacherArray.forEach(function (teacher) {
                var teacherCourseFit = getTeacherCourseFit(teacher, course);
                if (teacherCourseFit.fit > 0) {
                    teacherCourseFitArray.push(teacherCourseFit);
                }
                ;
            });
        });
    });
    return teacherCourseFitArray;
}
function sortCourseArrayTeachersTime(courseArray) {
    var sortedCourseArray = [];
    courseArray.forEach(function (course) {
        if (course.competentTeachers.length > 0) {
            var coursePotentialTeachersWithinTime_1 = [];
            course.competentTeachers.forEach(function (teacher) {
                if (checkMatchingTimeslotValues(course.timeSlotArray, teacher.timeSlotArray)) {
                    coursePotentialTeachersWithinTime_1.push(teacher);
                }
            });
            course.competentTeachers = coursePotentialTeachersWithinTime_1;
            sortedCourseArray.push(course);
        }
    });
    return sortedCourseArray;
}
function sortCourseArrayTeachersDistance(courseArray) {
    var sortedCourseArray = __spreadArray([], courseArray, true);
    sortedCourseArray.forEach(function (course) {
        course.competentTeachers.sort(function (_a, _b) {
            var a = _a.location;
            var b = _b.location;
            return a - b;
        });
    });
    return sortedCourseArray;
}
function assignCourseArrayTeachers(courseArray) {
    var assignedCourseArray = __spreadArray([], courseArray, true);
    assignedCourseArray.forEach(function (course) {
        course.competentTeachers.forEach(function (competentTeacher) {
            var teacherToAppoint = competentTeacher;
            var letMatch = false;
            if (typeof teacherToAppoint != 'undefined' && teacherToAppoint) {
                if (course.appointedTeacherArray.length < course.requiredTeacherCount) {
                    teacherToAppoint.timeSlotArray.forEach(function (teacherTimeslot) {
                        if (!teacherTimeslot.course) {
                            course.timeSlotArray.forEach(function (courseTimeslot) {
                                if (teacherTimeslot.startHour == courseTimeslot.startHour && teacherTimeslot.endHour == courseTimeslot.endHour) {
                                    teacherTimeslot.course = course;
                                    console.log("push?");
                                    letMatch = true;
                                }
                            });
                        }
                    });
                    teacherToAppoint.timeSlotArray.forEach(function (teacherTimeslot) {
                        if (teacherTimeslot.course) {
                            if (teacherTimeslot.course == course && letMatch) {
                                console.log("push !!");
                                teacherToAppoint.appointedCourse.push(course);
                                course.appointedTeacherArray.push(teacherToAppoint);
                            }
                        }
                    });
                }
                console.log("...", course.name, " - ", competentTeacher.name, course, competentTeacher);
            }
        });
        if (typeof course.appointedTeacherArray == 'undefined' || course.appointedTeacherArray.length == 0) {
            var attempts = 2;
            for (var attemptIndex = 0; attemptIndex < attempts; attemptIndex++) {
            }
        }
    });
    return assignedCourseArray;
}
var competenceArray = [{ label: "Math" }, { label: "Prince-2" }, { label: "Queen-1" }];
var timeslotArray = [{ startHour: 0830, endHour: 1000 }, { startHour: 1030, endHour: 1200 }, { startHour: 1300, endHour: 1430 }, { startHour: 1500, endHour: 1600 }, { startHour: 2000, endHour: 2100 }];
var teacherCourseFitMatrix;
var teacherArray = generateTeacherArray(10, competenceArray, timeslotArray);
var courseArray = generateCourseArray(20, competenceArray, timeslotArray);
var potentialCourseArray = checkPotentialCourses(courseArray, teacherArray);
var sortedTeacherCourseArray = sortCourseArrayTeachersDistance(sortCourseArrayTeachersTime(potentialCourseArray));
var assignedCourseArray = assignCourseArrayTeachers(sortedTeacherCourseArray);
function courseArrayRenderHtml(courseArray, containerSelector) {
    if (containerSelector === void 0) { containerSelector = "#course-list"; }
    var target = containerSelector;
    var courseArrayDom = document.querySelector(target);
    courseArray.forEach(function (course) {
        var courseDom = document.createElement('li');
        courseDom.classList.add('course__item');
        courseDom.appendChild(courseRenderHtml(course));
        courseArrayDom.appendChild(courseDom);
    });
}
function courseRenderHtml(course) {
    var wrapperDom = document.createElement('div');
    var courseNameDOM = document.createElement('label');
    var courseAppointedTeacherList = document.createElement('ul');
    var courseCompetenceListDOM = document.createElement('ul');
    var courseTimeSlotString = " ";
    var courseRequiredTeacherCountDOM = document.createElement('p');
    wrapperDom.classList.add('course__wrapper');
    courseNameDOM.classList.add('course__name');
    courseAppointedTeacherList.classList.add('course__teachers');
    course.timeSlotArray.forEach(function (timeslot) {
        courseTimeSlotString = courseTimeSlotString + "(".concat(timeslot.startHour, " - ").concat(timeslot.endHour, ")");
    });
    courseNameDOM.innerText = course.name + courseTimeSlotString;
    courseRequiredTeacherCountDOM.innerText = "req. teachers: ".concat(course.requiredTeacherCount);
    course.appointedTeacherArray.forEach(function (teacher) {
        var teacherDom = teacherRenderHtml(teacher);
        courseAppointedTeacherList.appendChild(teacherDom);
    });
    course.competenceArray.forEach(function (comptence) {
        var competenceDOM = document.createElement('div');
        competenceDOM.innerText = comptence.label;
        courseCompetenceListDOM.appendChild(competenceDOM);
    });
    wrapperDom.appendChild(courseNameDOM);
    wrapperDom.appendChild(courseRequiredTeacherCountDOM);
    wrapperDom.appendChild(courseCompetenceListDOM);
    if (course.appointedTeacherArray.length > 0) {
        wrapperDom.appendChild(courseAppointedTeacherList);
    }
    return wrapperDom;
}
function teacherRenderHtml(teacher) {
    var teacherItemDOM = document.createElement('li');
    var teacherAppointedCourseListDOM = document.createElement('ul');
    var teacherNameDOM = document.createElement('div');
    var teacherCompetenceListDOM = document.createElement('ul');
    var teacherTimeAvailableListDom = document.createElement('ul');
    teacherItemDOM.classList.add('teacher__container');
    teacherNameDOM.classList.add('teacher__name');
    teacherAppointedCourseListDOM.classList.add('teacher__list');
    teacherCompetenceListDOM.classList.add('teacher__list');
    teacherTimeAvailableListDom.classList.add('teacher__list');
    teacherNameDOM.innerText = teacher.name;
    teacher.appointedCourse.forEach(function (course) {
        var appCourseDOM = document.createElement('li');
        appCourseDOM.classList.add('teacher__appointed-course');
        appCourseDOM.innerText = "appointed '".concat(course.name, "'");
        teacherAppointedCourseListDOM.appendChild(appCourseDOM);
    });
    teacher.competenceArray.forEach(function (competence) {
        var teacherCompetenceDom = document.createElement('li');
        teacherCompetenceDom.innerText = competence.label;
        teacherCompetenceListDOM.appendChild(teacherCompetenceDom);
    });
    teacher.timeSlotArray.forEach(function (timeslot) {
        var timeslotDOM = document.createElement('li');
        var timeslotString = "(".concat(timeslot.startHour, ")-(").concat(timeslot.endHour, ")");
        timeslotDOM.innerText = timeslotString;
        teacherTimeAvailableListDom.appendChild(timeslotDOM);
    });
    teacherItemDOM.appendChild(teacherNameDOM);
    teacherItemDOM.appendChild(teacherAppointedCourseListDOM);
    teacherItemDOM.appendChild(teacherCompetenceListDOM);
    teacherItemDOM.appendChild(teacherTimeAvailableListDom);
    return teacherItemDOM;
}
function listTeacherArrayHtml(teacherArray, containerSelector) {
    if (containerSelector === void 0) { containerSelector = "#teacher-list"; }
    var target = containerSelector;
    var teacherArrayDom = document.querySelector(target);
    teacherArray.forEach(function (teacher) {
        var teacherDom = document.createElement('li');
        teacherDom.classList.add('teacher__item');
        teacherDom.appendChild(teacherRenderHtml(teacher));
        teacherArrayDom.appendChild(teacherDom);
    });
}
listTeacherArrayHtml(teacherArray);
courseArrayRenderHtml(courseArray);
//# sourceMappingURL=index.js.map