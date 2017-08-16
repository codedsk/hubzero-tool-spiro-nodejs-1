WWWDIR = ../www

all:

install:
	@. /etc/environ.sh; \
		use -e -r node-6.11.2; \
		cd ${WWWDIR}; \
		npm install;

clean:

distclean: clean
	rm -rf ${WWWDIR}/etc ${WWWDIR}/node_modules;
