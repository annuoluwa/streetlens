--
-- PostgreSQL database dump
--

\restrict hHf6t0RWM7eXuresR3doiA3eEaR75tKfGRReZmFeXvvPcOQP1pgr2JexJQgzfwK

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    action character varying(255),
    user_id integer,
    report_id integer,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer,
    report_id integer,
    content text NOT NULL,
    is_anonymous boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    parent_comment_id integer
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: evidence_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evidence_files (
    id integer NOT NULL,
    report_id integer,
    file_name character varying(255) NOT NULL,
    file_type character varying(100),
    file_size integer,
    uploaded_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.evidence_files OWNER TO postgres;

--
-- Name: evidence_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evidence_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evidence_files_id_seq OWNER TO postgres;

--
-- Name: evidence_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evidence_files_id_seq OWNED BY public.evidence_files.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    expense_id integer NOT NULL,
    title character varying(30) NOT NULL,
    price numeric(10,2) NOT NULL,
    category character varying(30) NOT NULL,
    essential boolean NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenses_expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_expense_id_seq OWNER TO postgres;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenses_expense_id_seq OWNED BY public.expenses.expense_id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    user_id integer,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    city character varying(100),
    postcode character varying(20),
    street character varying(255),
    property_type character varying(100),
    landlord_or_agency character varying(255),
    advert_source character varying(255),
    category character varying(100),
    is_anonymous boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    is_flagged boolean DEFAULT false,
    flat_number character varying(50) NOT NULL,
    admin_flagged boolean DEFAULT false,
    admin_verified boolean DEFAULT false,
    last_escalated_at timestamp without time zone
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq OWNER TO postgres;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    role character varying(20) DEFAULT 'user'::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: evidence_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence_files ALTER COLUMN id SET DEFAULT nextval('public.evidence_files_id_seq'::regclass);


--
-- Name: expenses expense_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses ALTER COLUMN expense_id SET DEFAULT nextval('public.expenses_expense_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, action, user_id, report_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, user_id, report_id, content, is_anonymous, created_at, parent_comment_id) FROM stdin;
1	\N	\N	Thank you for sharing	t	2025-12-27 22:22:16.357388	\N
8	7	32	I experienced the same issue here.	\N	2026-01-12 16:59:32.302488	\N
\.


--
-- Data for Name: evidence_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evidence_files (id, report_id, file_name, file_type, file_size, uploaded_at) FROM stdin;
16	31	evidence-1768236827016-886053843.png	\N	\N	2026-01-12 16:53:47.227499
17	32	evidence-1768236953632-179608504.jpg	\N	\N	2026-01-12 16:55:53.72917
18	33	evidence-1768237117337-636104516.png	\N	\N	2026-01-12 16:58:37.469299
19	34	evidence-1768237273195-701881556.webp	\N	\N	2026-01-12 17:01:13.276759
20	35	evidence-1768237552252-33705127.webp	\N	\N	2026-01-12 17:05:52.546044
22	37	evidence-1768237820415-118001701.webp	\N	\N	2026-01-12 17:10:20.557731
23	38	evidence-1768240468130-59736700.webp	\N	\N	2026-01-12 17:54:28.184686
24	39	evidence-1768242184700-259991933.webp	\N	\N	2026-01-12 18:23:04.753843
25	40	evidence-1768243874861-648035626.webp	\N	\N	2026-01-12 18:51:14.913618
26	41	evidence-1768244826618-419510285.webp	\N	\N	2026-01-12 19:07:06.671132
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (expense_id, title, price, category, essential, created_at) FROM stdin;
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, user_id, title, description, city, postcode, street, property_type, landlord_or_agency, advert_source, category, is_anonymous, created_at, is_flagged, flat_number, admin_flagged, admin_verified, last_escalated_at) FROM stdin;
34	7	Dirty	Dirty	Sunderland	S13 5ap	Midville	\N	\N	\N	Health Hazard	t	2026-01-12 17:01:13.271849	t	Flat 12	t	f	\N
35	7	Dirty	Dirty	Sunderland	S13 5ap	Midville	\N	\N	\N	Health Hazard	t	2026-01-12 17:05:52.500569	t	Flat 12	t	f	\N
37	7	Dirty	Dirty	Sunderland	S13 5ap	Midville	\N	\N	\N	Health Hazard	t	2026-01-12 17:10:20.549248	t	Flat12	t	f	\N
41	7	Dirty	Dirty	Sunderland	S13 5ap	Midville	\N	\N	\N	Health Hazard	t	2026-01-12 19:07:06.667248	t	Flat12	f	f	\N
40	7	Dirty	Dirty	Sunderland	S13 5ap	Midville	\N	\N	\N	Health Hazard	t	2026-01-12 18:51:14.910544	t	Flat 12	f	t	\N
39	7	Dirty	Dirty	Sunderland	S13 5ap	Midville	\N	\N	\N	Health Hazard	t	2026-01-12 18:23:04.750642	t	Flat12	f	f	\N
38	7	Dirty	The environment is so dirty.	Sunderland	S13 5ap	Midville	\N	\N	\N	Health Hazard	t	2026-01-12 17:54:28.179355	t	Flat12	f	t	\N
31	7	Dubious landlord	He never returns deposits	LONDON	SW12 6AP	Baker Street	Studio	John Bull	Facebook	Cheat	t	2026-01-12 16:53:47.215152	t	Unit 5	f	f	\N
32	7	Mould	The house is moldy.	Manchester	M13 5ap	edgeware	Studio	Acme Lettings	Gumtree	Health Hazard	t	2026-01-12 16:55:53.725155	t	Flat 5	f	f	\N
33	7	Don't rent from this landlord	He always picks a fight with his tenants.	Bristol	B13 5ap	Edgeware	Studio	Agency	Facebook	Noisy environment	t	2026-01-12 16:58:37.427374	t	Flat 4	f	f	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, created_at, role) FROM stdin;
1	sam	sam@dmail.com	$2b$10$BzHphgRg2Ol7oeBvZDGnr.rh6BD0q7GbALBfb39wYwNaYZRGjjMMG	2025-12-27 05:54:08.694735	user
2	elza	elza@dmail.com	$2b$10$a94xDNFt0ryTZZnlhjiMZuAxL2JNmEZX.33bD.PDYaWz0KF05szTy	2025-12-27 05:58:36.911423	user
4	zee	zee@dmail.com	$2b$10$DAKNUx6LRc8z5X1t8bK03uhq.4ADUxRNvDy4l3yqDo6pWB62B7V46	2025-12-27 07:04:06.248912	user
5	janedoe	janedoe@example.com	$2b$10$csBV.QYgOhcAfW1838xx/ehd7qraNyvOHDLPoo6Fppuiiu5/vCsiG	2025-12-28 08:29:00.227778	user
6	janedot	janedot@example.com	$2b$10$Q1MuWSUPmLEn88spGY.ZU.q8.nITCCeMH1oD6qPRk9ikHjgtSyNFW	2025-12-28 09:05:17.234983	user
11	admin	admin@email.com	$2b$10$MBeinmu/9dgh.mWYeivGiOzq/j./Bmx3SWQw9Jfewd5AhLpC1jYXK	2026-01-11 09:28:54.482722	admin
7	liz	liz@dmail.com	$2b$10$QzgnrWaexQRtsdGfk50.nOVk6f5ckbKk0HSiUKqmpOjfJ7rvQHuD6	2025-12-31 06:20:02.382061	user
13	TestUser	testuser_1768319795098@example.com	$2b$10$t560jGrILEcyTUg9VC.nV.tlrW80wl6N0M1HGHiJslCbCS1w67YdK	2026-01-13 15:56:35.279569	user
\.


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 8, true);


--
-- Name: evidence_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evidence_files_id_seq', 26, true);


--
-- Name: expenses_expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_expense_id_seq', 1, false);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_id_seq', 42, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: evidence_files evidence_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence_files
    ADD CONSTRAINT evidence_files_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: comments comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments comments_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id) ON DELETE CASCADE;


--
-- Name: evidence_files evidence_files_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence_files
    ADD CONSTRAINT evidence_files_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict hHf6t0RWM7eXuresR3doiA3eEaR75tKfGRReZmFeXvvPcOQP1pgr2JexJQgzfwK

