-- Table: public.token

-- DROP TABLE IF EXISTS public.token;

CREATE TABLE IF NOT EXISTS public.token
(
    token_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    refresh_token text COLLATE pg_catalog."default" NOT NULL,
    token_status bit(1) NOT NULL,
    creation_date timestamp without time zone NOT NULL DEFAULT 'now()',
    user_id integer NOT NULL,
    destroy_date timestamp without time zone,
    CONSTRAINT token_pkey PRIMARY KEY (token_id),
    CONSTRAINT token_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.token
    OWNER to postgres;