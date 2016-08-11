"""
Poll Google Static Maps API for a series of coordinates and test for presence 
of pixels with water color.  Store matching images in a subdirectory.
"""
import os
import optparse
from html import XHTML


class CommandError(Exception):
	pass


parser = optparse.OptionParser(usage='%prog [options] -o <output path>')

parser.add_option('-o', '--outputfile', action="store", 
	              dest="outputfile", default="index.html",
	              help="Path to an output file. Defaults to index.html")


def write_html(outputfile):
	# read the input folder
	h = XHTML()
	outerdiv = h.div
	imgs = os.listdir('out')
	imgs.reverse()
	for i in range(1,len(imgs)):
		# rotation = i % 360
		ic = outerdiv.div(klass="imgcontainer")
		ic.img(src=imgs[i])
	with open(outputfile, 'w') as f:
		f.write(str(h))


if __name__ == '__main__':
	options, args =  parser.parse_args()
	if not options.outputfile:
		raise CommandError("Error: Missing Google Maps API key.\n\nUsage:{}".format(parser.usage))
	

	write_html(options.outputfile)
	




	