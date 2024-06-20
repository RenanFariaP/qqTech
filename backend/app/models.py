from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship, declarative_base
from .database import Base

# Tabela de junção profiles_modules
profiles_modules = Table(
    'profiles_modules', Base.metadata,
    Column('profile_id', Integer, ForeignKey('profiles.id'), primary_key=True),
    Column('module_id', Integer, ForeignKey('modules.id'), primary_key=True)
)

# Tabela de junção modules_transactions
modules_transactions = Table(
    'modules_transactions', Base.metadata,
    Column('module_id', Integer, ForeignKey('modules.id'), primary_key=True),
    Column('transaction_id', Integer, ForeignKey('transactions.id'), primary_key=True)
)

# Tabela de junção modules_methods
modules_methods = Table(
    'modules_methods', Base.metadata,
    Column('module_id', Integer, ForeignKey('modules.id'), primary_key=True),
    Column('method_id', Integer, ForeignKey('methods.id'), primary_key=True)
)

class Profile(Base):
    __tablename__ = 'profiles'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    users = relationship('User', back_populates='profile')
    modules = relationship('Module', secondary=profiles_modules, back_populates='profiles')

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    registration = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    profile = relationship('Profile', back_populates='users')

class Module(Base):
    __tablename__ = 'modules'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    TAG = Column(String(5), unique=True, nullable=False)
    profiles = relationship('Profile', secondary=profiles_modules, back_populates='modules')
    transactions = relationship('Transaction', secondary=modules_transactions, back_populates='modules')
    methods = relationship('Method', secondary=modules_methods, back_populates='modules')

class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    TAG = Column(String(5), unique=True, nullable=False)
    modules = relationship('Module', secondary=modules_transactions, back_populates='transactions')

class Method(Base):
    __tablename__ = 'methods'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    TAG = Column(String(5), unique=True, nullable=False)
    modules = relationship('Module', secondary=modules_methods, back_populates='methods')