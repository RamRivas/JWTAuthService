-- Table: public.html_method

-- DROP TABLE IF EXISTS public.html_method;

CREATE TABLE IF NOT EXISTS public.html_method
(
    method_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    method_name character varying(200) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT html_method_pkey PRIMARY KEY (method_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.html_method
    OWNER to postgres;