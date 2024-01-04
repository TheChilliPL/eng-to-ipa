# `eng-to-ipa`

This library converts any English-like words into their phonemic IPA equivalents.
It is based on the 1976 report
[“Automatic Translation of English Text to Phonetics by Means of Letter-to-Sound Rules”](https://web.archive.org/web/20170209083912/http://www.dtic.mil/dtic/tr/fulltext/u2/a021929.pdf)
and works correctly for around 89–90% of words, frequency-weighed.

It's not meant to be a perfect solution by itself yet, but is to be paired with
a dictionary in the future.

The report cited above is based on British English, so the library is too.
Nonetheless, American English support could be added in the future, by including
a different set of rules.

## Theory

### Latin-letter representation of IPA

As in the report, we use an intermediate Latin-letter representation of IPA,
as follows:

| Standard IPA          | Representation | Example        |
| --------------------- | -------------- | -------------- |
| iː                    | IY             | b**ee**t       |
| ɪ                     | IH             | b**i**t        |
| eɪ<sup>[1](#f1)</sup> | EY             | g**a**te       |
| ɛ                     | EH             | g**e**t        |
| æ                     | AE             | f**a**t        |
| ɑː                    | AA             | f**a**ther     |
| ɒ                     | AO             | l**aw**n       |
| oʊ<sup>[2](#f2)</sup> | OW             | l**o**ne       |
| ʊ                     | UH             | f**u**ll       |
| u                     | UW             | f**oo**l       |
| ɝ, ɚ                  | ER             | m**ur**d**er** |
| ə                     | AX             | **a**bout      |
| ʌ                     | AH             | b**u**t        |
| aɪ                    | AY             | h**i**de       |
| aʊ                    | AW             | h**ow**        |
| ɔɪ                    | OY             | t**oy**        |
| p                     | P              | **p**ack       |
| b                     | B              | **b**ack       |
| t                     | T              | **t**ime       |
| d                     | D              | **d**ime       |
| k                     | K              | **c**oat       |
| g                     | G              | **g**oat       |
| f                     | F              | **f**ault      |
| v                     | V              | **v**ault      |
| θ                     | TH             | e**th**er      |
| ð                     | DH             | ei**th**er     |
| s                     | S              | **s**ue        |
| z                     | Z              | **z**oo        |
| ʃ                     | SH             | lea**sh**      |
| ʒ                     | ZH             | lei**s**ure    |
| h                     | HH             | **h**ow        |
| m                     | M              | su**m**        |
| n                     | N              | su**n**        |
| ŋ                     | NX             | su**ng**       |
| l                     | L              | **l**augh      |
| w                     | W              | **w**ear       |
| j                     | Y              | **y**oung      |
| r                     | R              | **r**ate       |
| t͡ʃ                    | CH             | **ch**ar       |
| d͡ʒ                    | JH             | **j**ar        |
| hw                    | WH             | **wh**ere      |

The representation is mostly used internally to provide support for the rules
in the report, but the library will provide methods to extract this representation
as well.

---

<sup><a name="f1">1</a></sup> The report says it's /e/, but in most English accents
it's pronounced /eɪ/.
<sup><a name="f2">2</a></sup> The report says it's /o/, but in most English accents
it's pronounced /oʊ~əʊ/.

### Special symbols appearing in the rules

The report uses the following special symbols in the rules:

| Symbol               | Meaning                                                                      | Details                                                                |
| -------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| #                    | One or more vowels                                                           | Vowels: A, E, I, O, U, Y                                               |
| \*                   | One or more consonants                                                       | Consonants: B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Z |
| .<sup>[3](#f3)</sup> | A voiced consonant                                                           | B, D, V, G, J, L, M, N, R, W, Z                                        |
| $                    | One consonant followed by an E or I                                          |                                                                        |
| %                    | One of (ER, E, ES, ED, ING, ELY): a suffix                                   |                                                                        |
| &                    | A sibilant                                                                   | S, C, G, Z, X, J, CH, SH                                               |
| @                    | A consonant influencing the sound of a following long _u_<sup>[4](#f4)</sup> |                                                                        |
| ^                    | One consonant                                                                |                                                                        |
| +                    | A front vowel                                                                | E, I, Y                                                                |
| :                    | Zero or more consonants                                                      |                                                                        |
| [SPACE]              | Beginning or end of a word                                                   |                                                                        |

---

<sup><a name="f3">3</a></sup> In the report, it's a bullet point. Using a normal
dot instead, just like in the SNOBOL code included.
<sup><a name="f4">4</a></sup> cf. _rule_ and _mule_
