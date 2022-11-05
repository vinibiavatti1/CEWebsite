#!/usr/bin/python3
#from time import sleep
import socket,time


IP = "89.38.98.12"
PORT = 4711
dt = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


def convert_to_dict(a):
    it = iter(a)
    res_dct = dict(zip(it, it))
    return res_dct


def gsquery(cmd):
    udpsock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udpsock.settimeout(3)
    udpsock.sendto(cmd.encode("UTF-8"), (IP, PORT))
    resp = udpsock.recvfrom(PORT)
    return resp


def fetch_info():
    resp = gsquery("\\info\\")
    list = resp[0].decode("UTF-8").split("\\")
    d = convert_to_dict(list[1:])
    return d


def fetch_players():
    resp = gsquery("\\players\\")
    list1 = resp[0].decode("UTF-8").split("\\")
    d = convert_to_dict(list1[1:])
    return d


def print_info():
    try:
        print("==Server Status==")
        print("")
        info = fetch_info()
        print("Status: Online" + "\n" + "Players: " + info['numplayers'] + "/" + info['maxplayers'] + "\nMap: " + info['mapname'] + "\nMode: " + info['gametype'])
        if info['numplayers'] != "0":
            players = fetch_players()
            print("")
            print("==Players==")
            print("")
            print("Name\t\tFrags\tDeaths\tTeam")
            for i in range(int(info['numplayers'])):
                name_indent = '\t'
                if len(players['player_' + str(i)]) < 8:
                    name_indent *= 2
                print(
                    players[f'player_{i}'] + name_indent + players[f'frags_{i}'] + "\t" + players[f'deaths_{i}'] + "\t" + players[f'team_{i}']
                )
        print("")
    except Exception:
        print("Status: Offline")
        print("")
    print("Updated: " + dt + " GMT")


if __name__ == '__main__':
    print_info()
