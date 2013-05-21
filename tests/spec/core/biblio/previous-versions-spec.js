describe('Core — Definitions', function() {
    var MAXOUT = 5000,
        basicConfig = {
            editors: [{
                    name: 'Marcos Caceres'
                }],
            specStatus: 'WD',
            localBiblio: {
                'FOO': {
                    title: 'TEST 7!',
                    previousVersions: [{
                            key: 'TEST-7',
                            href: 'http://test'
                        }]
                }
            }
        };

    it("expands 'previousVersions' props of DAHUT", function() {
        var doc;
        runs(function() {
            var body = '<section></section>';
            makeRSDoc({
                config: basicConfig,
                body: $(body)
            }, function(rsdoc) {
                doc = rsdoc;
            });
        });
        waitsFor(function() {
            return doc;
        }, MAXOUT);
        runs(function() {
            var iframe = document.querySelector('iframe'),
                biblio = iframe.contentWindow.berjon.biblio,
                dahut = biblio.DAHUT;

            var test1 = biblio['DAHUT-TEST1'];
            expect(test1.authors[0]).toEqual(dahut.authors[0]);
            expect(test1.etAl).toEqual(dahut.etAl);
            expect(test1.title).toEqual(dahut.title);
            expect(test1.date).toEqual(dahut.date);
            expect(test1.status).toEqual(dahut.status);
            expect(test1.href).toEqual(dahut.href);

            var test2 = biblio['DAHUT-TEST2'];
            expect(test2.authors[0]).toEqual(dahut.authors[0]);
            expect(test2.etAl).toEqual(true);
            expect(test2.title).toEqual(dahut.title);
            expect(test2.date).toEqual(dahut.date);
            expect(test2.status).toEqual(dahut.status);
            expect(test2.href).toEqual('http://test.com');

            var test3 = biblio['DAHUT-TEST3'];
            expect(test3.authors[0]).toEqual(dahut.authors[0]);
            expect(test3.etAl).toEqual(true);
            expect(test3.title).toEqual('test title');
            expect(test3.date).toEqual('test date');
            expect(test3.status).toEqual('test status');
            expect(test3.href).toEqual(dahut.href);

            var test4 = biblio['DAHUT-TEST4'];
            expect(test4.authors[0]).toEqual('Test Author 1');
            expect(test4.authors[1]).toEqual('Test Author 2');
            expect(test4.etAl).toEqual(true);
            expect(test4.title).toEqual(dahut.title);
            expect(test4.date).toEqual(dahut.date);
            expect(test4.status).toEqual(dahut.status);
            expect(test4.href).toEqual(dahut.href);

            var test5 = biblio['DAHUT-TEST5'],
                props = Object.getOwnPropertyNames(test5);
            expect(props.length).toEqual(1);
            expect(props[0]).toEqual('aliasOf');
            expect(test5['aliasOf']).toEqual('DC11');
            flushIframes();
        });
    });

    it('should display previousVersions', function() {
        var doc;
        runs(function() {
            var body = '<section>[[!DAHUT-TEST1]],[[!DAHUT-TEST2]],';
            body += '[[!DAHUT-TEST3]],[[!DAHUT-TEST4]],[[!DAHUT-TEST5]],';
            body += '[[!DAHUT-TEST6]],[[!FOO]],[[!FOO-TEST7]]</section>';
            makeRSDoc({
                config: basicConfig,
                body: $(body)
            }, function(rsdoc) {
                doc = rsdoc;
            });
        });
        waitsFor(function() {
            return doc;
        }, MAXOUT);
        runs(function() {
            var test, query, content, i;
            //id checks
            for (i = 1; i <= 6; i++) {
                test = 'bib-DAHUT-TEST' + i,
                query = '#' + test;
                expect(doc.querySelector(query).id).toEqual(test);
            }
            expect(doc.querySelector('#bib-FOO', doc).id).toEqual('bib-FOO');
            expect(doc.querySelector('#bib-FOO-TEST7').id).toEqual('bib-FOO-TEST7');
            //text content check
            for (i = 1; i <= 6; i++) {
                test = 'DAHUT-TEST' + i,
                query = '#bib-' + test,
                content = '[' + test + ']';
                expect(doc.querySelector(query).textContent).toEqual(content);
            }
            content = doc.querySelector('#bib-FOO').textContent;
            expect(content).toEqual('[FOO]');
            content = doc.querySelector('#bib-FOO-TEST7').textContent;
            expect(content).toEqual('[FOO-TEST7]');
            flushIframes();
        });
    });
});
