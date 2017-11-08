/**
 * Created by dodo on 2017. 10. 12..
 */
const ref = require("./fbdb").db.ref("operation");
const Account = require("./Account");
const Err = require("./Err");
const Reservation = require("./Reservation");
const dateArranger = require("../utils/dateArranger");
class Operation {
    constructor(product, area, date) {
        this.product = product;
        this.area = area;
        this.date = date;
        this.teams = [];
    }

    /**
     * Reservation이 저장된 후 해당 예약을 operation에 할당한다.
     * Operation은 날짜와 상품명으로 구분이 되며, 하나의 operation에는 다수의 team이 존재하며, team에 각각의 reservation이 할당된다.
     * @param reservation {Reservation}
     * @param bus
     * @param callback {v1ReservationCallback}
     */

    static assignOperation(reservation, bus, callback) {
        ref.child(reservation.date).child(reservation.product).once("value", (snapshot) =>{
            let operation = snapshot.val();
            if (!operation) {
                operation = new Operation(reservation.product, reservation.area, reservation.date);
                let updatable = {};
                updatable[`product`] = operation.product;
                updatable[`area`] = operation.area;
                updatable[`date`] = operation.date;
                ref.child(reservation.date).child(reservation.product).update(updatable, (err) => {
                    if (err) return callback(err);
                    if (reservation.product.match(/Private/i)) {
                        forPrivateReservation(reservation, callback);
                    } else if (reservation.people > bus.max) {
                        forLargeReservation(reservation, operation, bus, callback);
                    } else {
                        forRegularReservation(reservation, operation, bus, callback);
                    }
                });
            } else {
                if (reservation.product.match(/Private/i)) {
                    forPrivateReservation(reservation, callback);
                } else if (reservation.people > bus.max) {
                    forLargeReservation(reservation, operation, bus, callback);
                } else {
                    forRegularReservation(reservation, operation, bus, callback);
                }
            }
        },callback);
    }
}

module.exports = Operation;

class Team {
    constructor() {
        this.guides = [];
        this.message = "";
        this.reservations = {};
        this.bus_name = "";
        this.bus_cost = "";
        this.time = new Date().getTime();
    }
}

/**
 * 일반적인 예약을 배치하는 함수입니다.
 * @param reservation {Reservation}
 * @param operation {object}
 * @param bus
 * @param callback {v1ReservationCallback}
 */
function forRegularReservation(reservation, operation, bus, callback) {
    "use strict";
    if(!operation.teams) operation.teams =[];
    for (let t in operation.teams) {
        if (!operation.teams.hasOwnProperty(t)) continue;
        let people = 0;
        const reservations = operation.teams[t].reservations;
        for (let rid in reservations) {
            if(!reservations.hasOwnProperty(rid)) continue;
            people += reservations[rid].people;
        }
        if (people + reservation.people <= bus.max) {
            reservations[reservation.id] = reservation;
            ref.child(reservation.date)
                .child(reservation.product)
                .child("teams")
                .child(t)
                .child("reservations")
                .child(reservation.id)
                .update(reservation, callback);
            return;
        }
    }
    const team = new Team();
    team.reservations[reservation.id] = reservation;
    team.bus_name = bus.name;
    team.bus_cost = getBusSize(reservation, bus).cost;
    return ref.child(reservation.date).child(reservation.product).child("teams").push(team, callback);
}

/**
 * Private 예약을 배치하는 함수입니다.
 * Private의 경우 하나의 예약마다 하나의 team이 하나씩 생성됩니다.
 * @param reservation {Reservation}
 * @param callback {v1ReservationCallback}
 */
function forPrivateReservation(reservation, callback) {
    const team = new Team();
    team.reservations[reservation.id] = reservation;
    team.bus_name = "Private";
    team.bus_cost = "0";
    ref.child(reservation.date).child(reservation.product).child("teams").push(team, callback);
}

/**
 * 인원 수가 버스 최대 수용량을 넘는 큰 규모의 예약을 처리하는 함수입니다.
 * @param reservation {Reservation}
 * @param operation {Operation}
 * @param bus {}
 * @param callback {v1ReservationCallback}
 */
function forLargeReservation(reservation, operation, bus, callback) {
    let buses = reservation.people / bus.max;
    const lastPax = reservation.people % bus.max;
    let done = 0;
    let interrupt = false;
    for (; buses > 0; buses—) {
        let team = new Team();
        team.reservations[reservation.id] = reservation;
        let busSize = (buses >= 1 ) ? bus.size[bus.size.length - 1] : getBusSize(people, bus);
        team.bus_name = bus.name;
        team.bus_cost = (buses >= 1) ? busSize.cost : lastPax;
        if(!operation.teams) operation.teams =[];
        operation.teams.push(team);
    }
    operation.teams.forEach((team) => {
        ref.child(reservation.date).child(reservation.product).child("teams").push(team, (err) => {
            if (err) {
                interrupt = true;
                return callback(err);
            }
            done++;
            if (interrupt || done === operation.teams.length) {
                callback(null);
            }
        });
    })
}
/**
 * 인원수에 맞는 버스를 배정합니다.
 * @param reservation
 * @param bus
 */
function getBusSize(reservation, bus) {
    return bus.size[bus.size.length - 1];
}
