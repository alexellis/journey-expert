from urlparse import urlparse
import string

def handle(st):
    val = st

    val = val.replace("\xe2\x80\xa6", " ") # '...'

    parts = val.split(" ")
    bits = [part for part in parts if not urlparse(part).scheme and part != "&amp;" ]
    val = string.join(bits, " ")
    print(val)

