#!/usr/bin/python3
import socket, time, json


IP = "89.38.98.12"
PORT = 4711
INFO_ENDPOINT = 'info'
PLAYERS_ENDPOINT = 'players'
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


def fetch_data(name):
    resp = gsquery(f"\\{name}\\")
    list = resp[0].decode("UTF-8").split("\\")
    d = convert_to_dict(list[1:])
    return d


def print_info():
    try:
        info = fetch_data(INFO_ENDPOINT)
        info['players'] = []
        info['updateDate'] =  dt
        if info['numplayers'] != "0":
            players = fetch_data(PLAYERS_ENDPOINT)
            for i in range(int(info['numplayers'])):
                info['players'].append({
                    'name': players[f'player_{i}'],
                    'frags': players[f'frags_{i}'],
                    'deaths': players[f'deaths_{i}'],
                    'team': players[f'team_{i}']
                })
        print(json(info, indent=4))
    except Exception:
        print(json(dict(status='Offline', updateDate=dt), indent=4))


if __name__ == '__main__':
    print_info()
