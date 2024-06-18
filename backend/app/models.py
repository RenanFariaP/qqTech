from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Profile(Base):
    __tablename__ = 'profiles'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    users = relationship('User', back_populates='profile')
    modules = relationship('Module', back_populates='profile')

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    registration = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    profile = relationship('Profile', back_populates='users')

class Module(Base):
    __tablename__ = 'modules'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    TAG = Column(String(5), unique=True, nullable=False)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    profile = relationship('Profile', back_populates='modules')
    transactions = relationship('Transaction', back_populates='module')
    methods = relationship('Method', back_populates='module')

class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    TAG = Column(String(5), unique=True, nullable=False)
    module_id = Column(Integer, ForeignKey('modules.id'))
    module = relationship('Module', back_populates='transactions')

class Method(Base):
    __tablename__ = 'methods'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255))
    TAG = Column(String(5), unique=True, nullable=False)
    module_id = Column(Integer, ForeignKey('modules.id'))
    module = relationship('Module', back_populates='methods')