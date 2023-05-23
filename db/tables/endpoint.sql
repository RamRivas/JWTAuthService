-- Table: public.endpoint

-- DROP TABLE IF EXISTS public.endpoint;

CREATE TABLE IF NOT EXISTS public.endpoint
(
    endpoint_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    endpoint_name character varying(200) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT endpoint_pkey PRIMARY KEY (endpoint_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.endpoint
    OWNER to postgres;