-- Table: public.endpoint_role_method

-- DROP TABLE IF EXISTS public.endpoint_role_method;

CREATE TABLE IF NOT EXISTS public.endpoint_role_method
(
    endpoint_id integer NOT NULL,
    role_id integer NOT NULL,
    method_id integer NOT NULL,
    CONSTRAINT endpoint_role_method_pkey PRIMARY KEY (endpoint_id, role_id, method_id),
    CONSTRAINT erm_endpoint_fk FOREIGN KEY (endpoint_id)
        REFERENCES public.endpoint (endpoint_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT erm_method_fk FOREIGN KEY (method_id)
        REFERENCES public.html_method (method_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT erm_role_fk FOREIGN KEY (role_id)
        REFERENCES public.role (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.endpoint_role_method
    OWNER to postgres;